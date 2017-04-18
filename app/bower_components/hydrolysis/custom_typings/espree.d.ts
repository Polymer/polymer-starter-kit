declare module 'espree' {
  import * as estree from 'estree';
  interface ParseOpts {
    attachComment: boolean;
    comment: boolean;
    loc: boolean;
    ecmaVersion?: number;
    ecmaFeatures?: {
      arrowFunctions: boolean;
      blockBindings: boolean;
      destructuring: boolean;
      regexYFlag: boolean;
      regexUFlag: boolean;
      templateStrings: boolean;
      binaryLiterals: boolean;
      unicodeCodePointEscapes: boolean;
      defaultParams: boolean;
      restParams: boolean;
      forOf: boolean;
      objectLiteralComputedProperties: boolean;
      objectLiteralShorthandMethods: boolean;
      objectLiteralShorthandProperties: boolean;
      objectLiteralDuplicateProperties: boolean;
      generators: boolean;
      spread: boolean;
      classes: boolean;
      modules: boolean;
      jsx: boolean;
      globalReturn: boolean;
    }
  }
  export function parse(text: string, opts?: ParseOpts):estree.Program;
}
