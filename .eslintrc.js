module.exports = {
	parser: "@typescript-eslint/parser",
	plugins: ["@typescript-eslint"],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended"
	],
	rules: {
		"@typescript-eslint/no-require-imports": "off",
		"no-bitwise": "off",
		"no-console": ["warn", { "allow": ["warn", "error"] }],
		"no-empty": ["error", { "allowEmptyCatch": false }],
		"prefer-arrow-callback": "off",
		"quotes": ["error", "single", { "avoidEscape": true, "allowTemplateLiterals": false }],
		"no-new-wrappers": "error",
		"no-eval": "error",
		"no-cond-assign": "error",
		"new-parens": "off",
		"no-var": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/member-ordering": [
			"error",
			{
				"default": [
					"public-instance-field",
					"public-static-field",
					"protected-instance-field",
					"protected-static-field",
					"private-instance-field",
					"private-static-field",
					"constructor",
					"public-instance-method",
					"public-static-method",
					"protected-instance-method",
					"protected-static-method",
					"private-instance-method",
					"private-static-method"
				]
			}
		]
	}
};
