const { TestEnvironment } = require('jest-environment-jsdom');
const { TextEncoder, TextDecoder } = require('node:util');
const { ReadableStream, WritableStream, TransformStream } = require('node:stream/web');
const { BroadcastChannel } = require('node:worker_threads');
const { Blob, File } = require('node:buffer');
const web = { fetch, Request, Response, Headers, FormData, AbortController, AbortSignal, TextEncoder, TextDecoder, ReadableStream, WritableStream, TransformStream, BroadcastChannel, Blob, File };
module.exports = class extends TestEnvironment {
  constructor(config, context) {
    super(config, context);
    Object.assign(this.global, web);
  }
};
