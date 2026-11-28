import { setupServer } from 'msw/node';
import { handlers } from '../../src/mocks/handlers.js';
export const server = setupServer(...handlers);
