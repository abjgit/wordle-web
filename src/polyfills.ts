import { Buffer } from 'buffer';

window.global = window;
(window as any).Buffer = Buffer;
