import { Buffer } from 'buffer';

// Polyfill global object
if (typeof window !== 'undefined') {
  window.global = window;
  window.Buffer = Buffer;
  
  // Additional required globals for web3
  const globals = {
    process: {
      env: {},
      version: '',
      nextTick: (fn: Function) => setTimeout(fn, 0)
    }
  };
  
  Object.assign(window, globals);
}
