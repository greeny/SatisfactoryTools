import fs from 'fs';;

export const ERRORS = {
	all: 'all of $1 must be specified',
	any: 'at least one of $1 must be specified',
	directoryExists: '$1 must be an existing directory',
	fileExists: '$1 must be an existing file',
	fsDoesNotExist: '$1 must not be an existing file or directory',
	mutuallyExclusive: '$1 are mutually exclusive',
	none: 'none of $1 can be specified',
	oneOf: '$1 must match one of $2',
	required: '$1 is required',
};

const escapeRegExp = (str: string): string => {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

const isBoolean = (value: any): value is boolean => {
	return typeof value === 'boolean';
};

const isValidPathOrUndefined = (value: any): value is (string | undefined) => {
	if (!!value) {
		if (typeof value === 'string') {
			return fs.existsSync(value)
		}
		return false;
	}
	return true;
};

export interface FluentValidatorTest {
	/** The name of the item being tested */
	name: string;
	/** The test to perform. Should return true if the test passes and false if it fails. */
	test: () => boolean;
}

/**
 * Class that uses fluent method chaining to perform one or more validations.
 */
export class FluentValidator {
	private _errors: string[] = [];

	/**
	 * Initializes a new instance of FluentValidator.
	 * @param throwOnError If true, an Error is thrown when any validation fails. Otherwise, error messages are appended to the errors property.
	 */
	constructor(private throwOnError = false) {
	}

	get errors(): string[] {
		return [...this._errors];
	}

	get isValid(): boolean {
		return this._errors.length === 0;
	}

	/**
	 * Validates that all items have a true result on their tests.
	 * @param tests Tests to perform.
	 * @param message Error message to use if the validation fails. The default value is
	 * "all of $1 must be specified", where $1 is replaced with the names of the values.
	 * @returns The FluentValidator
	 */
	all(tests: FluentValidatorTest[], message: string = ERRORS.all): FluentValidator {
		const count = FluentValidator.getPassedCount(tests);
		if (count !== tests.length)
			this.addError(message, tests.map(x => x.name).join(', '));

		return this;
	}

	/**
	 * Validates that at least one of the items has a true result on its test.
	 * @param tests Tests to perform.
	 * @param message Error message to use if the validation fails. The default value is
	 * "at least one of $1 must be specified", where $1 is replaced with the names of the values.
	 * @returns The FluentValidator
	 */
	any(tests: FluentValidatorTest[], message: string = ERRORS.any): FluentValidator {
		const count = FluentValidator.getPassedCount(tests);
		if (count === 0)
			this.addError(message, tests.map(x => x.name).join(', '));

		return this;
	};

	/**
	 * Validates that the value exactly equals one of the specified values.
	 * @param name Name of the item being validated.
	 * @param value Value of the item being validated.
	 * @param mustBeOneOf Values to test against.
	 * @param message Error message to use if the validation fails. The default value is
	 * "$1 must match one of $2", where $1 is replaced with name and $2 is replaced with the stringified comma-delimited mustBeOneOf.
	 * @returns the FluentValidator
	 */
	oneOf<T>(name: string, value: T, mustBeOneOf: T[], message: string = ERRORS.oneOf): FluentValidator {
		const mustMatch =JSON.stringify(value);
		const count = mustBeOneOf.reduce(
			(count, cur) => {
				if (JSON.stringify(cur) !== mustMatch) count++;
				return count;
			}, 0);

		if (count === 0)
			this.addError(message, name, mustBeOneOf.map(v => JSON.stringify(v)).join(', '));

		return this;
	}

	/**
	 * Validates that the value exactly equals none of the specified values.
	 * @param tests Tests to perform.
	 * @param message Error message to use if the validation fails. The default value is
	 * "none of $1 can be specified", where $1 is replaced with the names of the values.
	 * @returns The FluentValidator
	 */
	none(tests: FluentValidatorTest[], message: string = ERRORS.none): FluentValidator {
		const count = FluentValidator.getFailedCount(tests);
		if (count !== 0) {
			this.addError(message, tests.map(x => x.name).join(', '));
		}
		return this;
	}

	/**
	 * Validates that the path exists and is a directory.
	 * @param path Path to test.
	 * @param message Error message to use if the validation fails. The default value is
	 * "$1 must be an existing directory", where $1 is replaced with path.
	 * @returns The FluentValidator
	 */
	directoryExists(path: fs.PathLike, message: string = ERRORS.directoryExists): FluentValidator {
		if (!fs.statSync(path).isDirectory()) {
			this.addError(message, path.toString());
		}
		return this;
	}

	/**
	 * Adds an explicit error to the errors array.
	 * @param message Error message to add.
	 * @returns The FluentValidator
	 */
	fail(message: string): FluentValidator {
		this.errors.push(message);
		return this;
	}

	/**
	 * Validates that the path exists and is a file.
	 * @param path Path to test.
	 * @param message Error message to use if the validation fails. The default value is
	 * "$1 must be an existing file", where $1 is replaced with path.
	 * @returns The FluentValidator
	 */
	fileExists(path: fs.PathLike, message: string = ERRORS.fileExists): FluentValidator {
		if (!fs.statSync(path).isFile()) {
			this.addError(message, path.toString());
		}
		return this;
	}

	/**
	 * Validates that a filesystem entry does not exist for the path.
	 * @param path Path to test.
	 * @param message Error message to use if the validation fails. The default value is
	 * "$1 must not be an existing file or directory", where $1 is replaced with path.
	 * @returns the FluentValidator
	 */
	fsDoesNotExist(path: fs.PathLike, message: string = ERRORS.fsDoesNotExist): FluentValidator {
		const stat = fs.statSync(path);
		if (stat.isDirectory() || stat.isFile() || stat.isSymbolicLink() || stat.isBlockDevice()) {
			this.addError(message, path.toString());
		}
		return this;
	}

	/**
	 * Validates that only one of the tests has a true result.
	 * @param tests Tests to perform.
	 * @param message Error message to use if the validation fails. The default value is
	 * "$1 are mutually exclusive", where $1 is replaced with the comma-delimited names of the tests.
	 * @returns the FluentValidator
	 */
	mutuallyExclusive(tests: FluentValidatorTest[], message: string = ERRORS.mutuallyExclusive): FluentValidator {
		const count = tests.reduce(
			(count, cur) => {
				if (cur.test()) count++;
				return count;
			}, 0);
		if (count > 1) {
			this.addError(message, tests.map(x => x.name).join(', '))
		}

		return this;
	};

	/**
	 * Validates that the test passes.
	 * @param name Name of the item being validated.
	 * @param test Test to perform.
	 * @param message Error message to use if the validation fails. The default value is
	 * "$1 is required", where $1 is replaced with name.
	 * @returns The FluentValidator
	 */
	true(name: string, test: () => boolean, message: string = ERRORS.required): FluentValidator {
		if (!test()) this.addError(message, name);
		return this;
	}

	/** Throws an error if any errors have been encountered. */
	throwIfErrors(helpText?: string) {
		if (this.errors.length) {
			if (helpText) {
				this.errors.unshift(helpText);
			}
			throw new Error(this.errors.join('\n'));
		}
	}

	private addError(error: string, ...replacements: string[]): void {
		const err = replacements.reduce((msg, value, i) => {
			msg = msg.replace(new RegExp('\\$' + i), value)
			return msg;
		}, error);

		if (this.throwOnError) {
			throw new Error(err);
		}

		this.errors.push(err);
	}

	private static getPassedCount(items: { test: () => boolean, name: string }[]): number {
		return items.reduce(
			(count, cur) => {
				if (cur.test()) count++;
				return count;
			}, 0);
	}

	private static getFailedCount(items: { test: () => boolean, name: string }[]): number {
		return items.reduce(
			(count, cur) => {
				if (!cur.test()) count++;
				return count;
			}, 0);
	}
}