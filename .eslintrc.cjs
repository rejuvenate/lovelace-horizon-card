module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
    project: "./tsconfig.json"
  },
  plugins: ["@typescript-eslint", "import", "simple-import-sort"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  rules: {
    "comma-dangle": "off",
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "func-names": "off",
    "no-empty-function": "off",
    "default-case": "off",
    "import/named": "off",
    "import/namespace": "off",
    "import/default": "off",
    "import/no-named-as-default-member": "off",
    "import/no-unresolved": "off",
    "import/prefer-default-export": "off",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "import/no-named-as-default": "error",
    "import/no-cycle": "error",
    "import/no-unused-modules": "error",
    "import/no-deprecated": "error",
    "no-return-await": "off",
    "no-use-before-define": ["error", { "functions": false }],
    "class-methods-use-this": "off",
    "@typescript-eslint/return-await": "error",
    "@typescript-eslint/no-misused-promises": ["error", { checksVoidReturn: false }],
    "@typescript-eslint/no-floating-promises": ["error", { ignoreVoid: true }],
    "@typescript-eslint/no-use-before-define": ["error", { functions: false }],
    "@typescript-eslint/no-throw-literal": "off",
    "@typescript-eslint/lines-between-class-members": ["error", { exceptAfterSingleLine: true }],
    "@typescript-eslint/no-empty-function": ["off"],
    "@typescript-eslint/ban-ts-comment": ["warn"],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "function",
        format: [
          "camelCase",
          "PascalCase"
        ],
        filter: {
          regex: "Route$",
          match: false
        }
      }
    ],
    "jsx-a11y/click-events-have-key-events": "off",
    "react/require-default-props": "off",
    "no-underscore-dangle": ["error", { allowAfterThis: true }],
    "no-debugger": "error",
    "no-console": "error",
    "no-restricted-syntax": [
      "error",
      {
        selector: "ForInStatement",
        message: "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array."
      },
      {
        selector: "LabeledStatement",
        message: "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand."
      },
      {
        selector: "WithStatement",
        message: "`with` is disallowed in strict mode because it makes code impossible to predict and optimize."
      }
    ]
  }
};
