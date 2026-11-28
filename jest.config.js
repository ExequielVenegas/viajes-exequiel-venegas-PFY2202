import { fileURLToPath } from 'node:url';
const transform = {
  '^.+\\.[jt]sx?$': ['babel-jest', {
    babelrc: false,
    configFile: false,
    presets: [['@babel/preset-react', { runtime: 'automatic' }]],
    plugins: [fileURLToPath(new URL('./tests/support/vite-env.cjs', import.meta.url))],
  }],
};
export default {
  projects: [
    {
      displayName: 'componentes',
      testEnvironment: '<rootDir>/tests/support/environment.cjs',
      testEnvironmentOptions: { url: 'http://localhost:5173/', customExportConditions: ['node', 'node-addons'] },
      testMatch: ['<rootDir>/tests/**/*.test.jsx'],
      setupFilesAfterEnv: ['<rootDir>/tests/support/setup.js'],
      transform,
      extensionsToTreatAsEsm: ['.jsx'],
    },
    {
      displayName: 'integracion',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/tests/**/*.test.js'],
      transform,
      extensionsToTreatAsEsm: ['.jsx'],
    },
  ],
  collectCoverageFrom: ['src/**/*.{js,jsx}'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'html', 'lcov', 'json-summary'],
  coverageThreshold: { global: { statements: 50, functions: 50, lines: 50 } },
};
