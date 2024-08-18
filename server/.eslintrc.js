module.exports = {
  root: true,
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],

  parserOptions: {
    sourceType: "module",
    ecmaVersion: "latest",
  },
  ignorePatterns: ["dist"],
  rules: {
    "max-len": [
      "error",
      {
        code: 120, // Длина строки для кода
        ignoreComments: true,
        ignoreUrls: true, // Игнорировать URL
        ignoreStrings: true, // Игнорировать строки
        ignoreTemplateLiterals: true, // Игнорировать шаблонные строки
        ignorePattern: "^\\s*// eslint-disable-line", // Игнорировать комментарии с определенным паттерном
      },
    ],
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    quotes: ["error", "double", { allowTemplateLiterals: true }],
    "object-curly-spacing": ["error", "always"],
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-empty-interface": "off",
  },
};
