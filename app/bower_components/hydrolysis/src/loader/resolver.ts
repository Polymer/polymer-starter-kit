'use strict';

require("babel-polyfill");

/**
 * An object that knows how to resolve resources.
 */
export interface Resolver {
  /**
   * Attempt to resolve `deferred` with the contents the specified URL. Returns
   * false if the Resolver is unable to resolve the URL.
   */
  accept(path:string, deferred:Deferred<string>):boolean;
}


export class Deferred<T> {
  promise: Promise<T>;
  resolve: (val:(T|PromiseLike<T>))=>void;
  reject: (err:any)=>void;
  constructor() {
    const self = this;
    this.promise = new Promise<T>(function(resolve, reject) {
      self.resolve = resolve;
      self.reject = reject;
    });
  }
}
