import {Objects} from '@src/Utils/Objects';
import {Constants} from '@src/Constants';

export class Strings
{

	public static readonly OPENING_BRACE = 'openingBrace';
	public static readonly CLOSING_BRACE = 'closingBrace';
	public static readonly STRING = 'string';
	public static readonly EQUAL_SIGN = 'equal';
	public static readonly SEPARATOR = 'separator';
	public static readonly UNKNOWN = 'unknown';

	private static schematicTypes: {[key: string]: string} = {
		EST_Milestone: 'Milestone',
		EST_MAM: 'MAM Research',
		EST_Alternate: 'Alternate recipe',
		EST_Tutorial: 'Tutorial',
		EST_HardDrive: 'HDD Research',
		EST_ResourceSink: 'AWESOME Sink',
	};

	public static formatNumber(num: number|string, decimals: number = 3)
	{
		if (typeof num === 'string') {
			num = parseFloat(num);
		}
		return num.toFixed(decimals).replace(/\.?0+$/, '');
	}

	public static webalize(name: string): string
	{
		return name.replace(/[\s|.]+/gi, '-').replace(/[™:]/gi, '').toLowerCase();
	}

	public static copyToClipboard(text: string, displayNotification: string = '', delay: number = 3000): boolean
	{
		const textArea = document.createElement('textarea');
		textArea.style.position = 'fixed';
		textArea.style.top = '0';
		textArea.style.left = '0';
		textArea.style.width = '2em';
		textArea.style.height = '2em';
		textArea.style.padding = '0';
		textArea.style.border = 'none';
		textArea.style.outline = 'none';
		textArea.style.boxShadow = 'none';
		textArea.style.background = 'transparent';
		textArea.value = text;

		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		let result = false;
		try {
			result = document.execCommand('copy');
		} catch (err) {
			console.error(err);
		}

		document.body.removeChild(textArea);

		if (displayNotification !== '') {
			const toast = document.createElement('div');
			toast.className = 'toast';
			toast.innerHTML = '<div class="toast-header"><span class="far fa-copy mr-2"></span><strong class="mr-auto">Copied</strong><button type="button" class="close" data-dismiss="toast"><span class="fas fa-times"></span></button></div>' +
				'<div class="toast-body">' + displayNotification + '</div>';
			document.getElementById('toasts')?.appendChild(toast);
			$(toast).toast({
				delay: delay,
			});
			$(toast).toast('show');
		}

		return result;
	}

	public static stackSizeFromEnum(size: string): number
	{
		switch (size) {
			case 'SS_ONE':
				return Constants.STACK_SIZE.ONE;
			case 'SS_SMALL':
				return Constants.STACK_SIZE.SMALL;
			case 'SS_MEDIUM':
				return Constants.STACK_SIZE.MEDIUM;
			case 'SS_BIG':
				return Constants.STACK_SIZE.BIG;
			case 'SS_HUGE':
				return Constants.STACK_SIZE.LARGE;
			case 'SS_FLUID':
				return 50000;
			default:
				throw new Error('Invalid stack size ' + size);
		}
	}

	public static convertSchematicType(type: string): string
	{
		return Strings.schematicTypes[type] ? Strings.schematicTypes[type] : type;
	}

	public static unserializeDocs(text: string): any
	{
		const parsers: {[index: string]: RegExp} = {};
		parsers[Strings.OPENING_BRACE] = /\(/;
		parsers[Strings.CLOSING_BRACE] = /\)/;
		parsers[Strings.STRING] = /[a-zA-Z0-9:\\/.'"_\-]+/;
		parsers[Strings.EQUAL_SIGN] = /=/;
		parsers[Strings.SEPARATOR] = /,/;

		try {
			return Strings.parseTokens(Strings.tokenize(text, parsers, Strings.UNKNOWN), 0).result;
		} catch (e) {
			throw new Error('Invalid string: ' + text + '\n' + e);
		}
	}

	private static parseTokens(tokens: IToken[], currentIndex: number): {result: any, currentIndex: number}
	{
		let result: any = null;
		let index = currentIndex;
		for (; index < tokens.length; index++) {
			switch (tokens[index].type) {
				case Strings.OPENING_BRACE:
					if (result === null) {
						result = [];
					} else if (Array.isArray(result) || Objects.isObject(result)) {
						const parsed = this.parseTokens(tokens, index + 1);
						if (Array.isArray(result)) {
							result.push(parsed.result);
						} else {
							result[result.length] = parsed.result;
						}
						index = parsed.currentIndex - 1;
					}
					break;
				case Strings.CLOSING_BRACE:
					return {
						result: result,
						currentIndex: index + 1,
					};
				case Strings.STRING:
					if (tokens[index + 1] && tokens[index + 1].type === Strings.EQUAL_SIGN) {
						if (result === null) {
							result = {};
						} else if (Array.isArray(result)) {
							if (result.length) {
								throw new Error('Mixed array and object');
							}
							result = {};
						}

						const key = tokens[index].token;
						if (!tokens[index + 2]) {
							throw new Error('Unexpected end of input.');
						}
						if (tokens[index + 2].type === Strings.STRING) {
							result[key] = tokens[index + 2].token;
							index += 2;
						} else if (tokens[index + 2].type === Strings.OPENING_BRACE) {
							const parsed = this.parseTokens(tokens, index + 2);
							result[key] = parsed.result;
							index = parsed.currentIndex - 1;
						} else {
							throw new Error('Expected string or (, got ' + tokens[index + 2].token);
						}
					} else {
						if (result === null) {
							result = tokens[index].token;
						} else {
							if (typeof result === 'string') {
								result = [result];
							} else if (!Array.isArray(result)) {
								throw new Error('Mixed array and object');
							}
							result.push(tokens[index].token);
						}
					}

					if (!(!tokens[index + 1] || tokens[index + 1].type === Strings.SEPARATOR || tokens[index + 1].type === Strings.CLOSING_BRACE)) {
						throw new Error('Expected separator, closing brace or end of input, got ' + tokens[index + 1].token);
					}
			}
		}
		return {
			result: result,
			currentIndex: index,
		};
	}

	private static tokenize(text: string, parsers: {[index: string]: RegExp}, defaultToken?: any): IToken[]
	{
		let m;
		let r;
		let t;
		const tokens = [];
		while (text) {
			t = null;
			m = text.length;
			for (const key in parsers) {
				if (parsers.hasOwnProperty(key)) {
					r = parsers[key].exec(text);
					if (r && (r.index < m)) {
						t = {
							token: r[0],
							type: key,
							matches: r.slice(1),
						};
						m = r.index;
					}
				}
			}
			if (m) {
				tokens.push({
					token: text.substr(0, m),
					type: defaultToken || 'unknown',
				});
			}
			if (t) {
				tokens.push(t);
			}
			text = text.substr(m + (t ? t.token.length : 0));
		}
		return tokens;
	}

}

interface IToken
{
	token: string;
	type: string;
	matches?: any;
}
