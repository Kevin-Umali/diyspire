module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  transformIgnorePatterns: ["/node_modules/"],
  testMatch: ["**/__tests__/**/*.test.ts"],
};
