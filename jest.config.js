module.exports = {
  preset: "ts-jest",
  globals: {
    "ts-jest": {
      diagnostics: {
        warnOnly: true,
      },
    },
  },
  testEnvironment: "node",
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest",
    "^.+\\.mjs$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!graphql-request|other-esm-modules)",
  ],
};
