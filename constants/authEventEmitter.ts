import { EventEmitter } from 'events';

const globalForAuth = globalThis as unknown as { authEventEmitter?: EventEmitter };

if (!globalForAuth.authEventEmitter) {
  globalForAuth.authEventEmitter = new EventEmitter();
}

export const authEventEmitter = globalForAuth.authEventEmitter;
