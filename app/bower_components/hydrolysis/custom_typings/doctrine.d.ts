declare module 'doctrine' {
  export interface Tag {
    name: string;
    description: string;
    title: string;
    type: Type;
  }
  class Type {}
  export var type: {
    stringify(type: Type):string;
  }
  interface Options {
    unwrap: boolean;
    lineNumber: boolean;
    preserveWhitespace: boolean;
  }
  interface Annotation {
    description: string;
    tags: Tag[];
  }
  export function parse(content:string, options:Options):Annotation;
}
