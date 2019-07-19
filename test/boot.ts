/* eslint-disable-next-line @typescript-eslint/no-var-requires */
const JasmineCore = require('jasmine-core');
// @ts-ignore
global.getJasmineRequireObj = () => JasmineCore;

require('jasmine-ajax');
