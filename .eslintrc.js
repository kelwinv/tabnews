module.exports = {
	root: true,
	env: {
		browser: true,
		node: true,
		es6: true,
		jest: true,
	},
	extends: [
		"next/core-web-vitals",
		"eslint:recommended",
		"plugin:react/recommended",
		"plugin:prettier/recommended",
	],
	plugins: ["react", "unused-imports"],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: "latest",
		sourceType: "module",
	},
	rules: {
		"unused-imports/no-unused-imports": "error",
		"unused-imports/no-unused-vars": [
			"warn",
			{
				vars: "all",
				varsIgnorePattern: "^_",
				args: "after-used",
				argsIgnorePattern: "^_",
			},
		],
		"no-unused-vars": "off",
		"react/react-in-jsx-scope": "off",
		"import/no-anonymous-default-export": "warn",
	},
	settings: {
		react: {
			version: "detect",
		},
	},
};
