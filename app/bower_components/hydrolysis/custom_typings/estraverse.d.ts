declare module 'estraverse' {
  import {Node} from 'estree';
  interface Callbacks {
    enter?: (node:Node, parent:Node)=>any;
    leave?: (node:Node, parent:Node)=>any;

    fallback?: string;

    // Methods provided for you, don't override.
    break?: ()=>void;
    remove?: ()=>void;
    skip?: ()=>void;
    keys?: {};
  }
  export enum VisitorOption {
      Skip, Break, Remove
  }
  export function traverse(n: Node, callbacks:Callbacks):void;
}
