import { jest, beforeAll, afterEach, afterAll } from '@jest/globals';
import '@testing-library/jest-dom';
import { cleanup, configure } from '@testing-library/react';
import { server } from './server.js';
configure({ asyncUtilTimeout: 3000 });
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  cleanup();
  server.resetHandlers();
  window.history.replaceState(null, '', '/');
  jest.restoreAllMocks();
});
afterAll(() => server.close());
window.scrollTo = jest.fn();
