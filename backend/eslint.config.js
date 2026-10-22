module.exports = {
  // Environment defines global variables for the given environment (e.g., browser, node, etc.)
  env: {
    node: true, // If you're working with Node.js
    //es2021: true, // Modern JavaScript (ES2021)
    jest: true, // If you're using Jest for testing
  },

  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended", // Add this line for TypeScript support
  ],
  // Custom rules for your project
  rules: {
    // General Rules (overrides the default rules)
    "no-console": "warn", // Warn when using console.log in code
    "no-unused-vars": "warn", // Warn for unused variables
    "no-debugger": "warn", // Warn for debugger statements in the code
    "@typescript-eslint/no-unused-vars": ["warn"], // TypeScript specific unused vars rule
    "@typescript-eslint/explicit-module-boundary-types": "off", // Disable rule for module boundary types (if you're using TypeScript)

    // Prettier rules
    "prettier/prettier": [
      "error",
      {
        singleQuote: true,
        semi: true,
        trailingComma: "es5",
        printWidth: 80,
      },
    ],
  },

  // Overrides for specific files (e.g., if you have custom rules for certain files)
  overrides: [
    {
      files: ["*.test.ts", "*.spec.ts"], // You can customize rules for test files
      rules: {
        "no-unused-expressions": "off", // Allow unused expressions in tests
      },
    },
  ],
  ignores: [
    "**/node_modules/**", // Ignore node_modules folder
    "**/*.spec.ts", // Ignore test files
    "**/*.test.ts", // Ignore test files
  ],
};
