import { http, HttpResponse, delay, graphql as mockGraphql } from 'msw';
import { graphql } from 'graphql';
import { destinations } from './data.js';
import { schema, rootValue } from './schema.js';
export const handlers = [
  http.get('*/api/destinations', async () => {
    await delay(400);
    return HttpResponse.json(destinations);
  }),
  mockGraphql.link('*/graphql').operation(async ({ query, variables, operationName }) => {
    await delay(600);
    const result = await graphql({ schema, source: query, rootValue, variableValues: variables, operationName });
    return HttpResponse.json(result);
  }),
];
