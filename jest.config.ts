export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/out/", "<rootDir>/.vite/"],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};