// TODO(rictic): Upstream/merge with https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/estree/estree.d.ts

declare module 'estree' {
  export interface Node {
    type: string;
    leadingComments?: Comment[];
    trailingComments?: Comment[];
    loc?: SourceLocation;
  }
  export interface Comment {
    value: string;
  }
  export interface SourceLocation {
    source: string;
    start: Position;
    end: Position;
  }
  export interface Position {
    /** >= 1 */
    line: number;
    /** >= 0 */
    column: number;
  }
  export interface Identifier extends Node {
    // type: "Identifier"
    name: string;
  }
  // Literal extends expression?
  export interface Literal extends Node, Expression {
    // type: 'Literal';
    value: string | boolean | number | RegExp;
    raw: string;
  }
  export interface RegExpLiteral extends Literal {
    regex: {
      pattern: string;
      flags: string;
    };
  }
  export interface Program extends Node {
    // type: 'Program';
    sourceType: string; // "script" or "module"
    body: Statement[]|ModuleDeclaration[];
  }
  export interface Function extends Node {
    id?: Identifier;
    params: Pattern[];
    body: BlockStatement;
    generator?: boolean;
  }
  export interface Statement extends Node { }
  export interface ExpressionStatement extends Statement {
    // type: "ExpressionStatement";
    expression: Expression;
  }
  export interface BlockStatement extends Statement {
    // type: "BlockStatement";
    body: Statement[];
  }
  export interface EmptyStatement extends Statement {
    // type: "EmptyStatement";
  }
  export interface DebuggerStatement extends Statement {
    // type: "DebuggerStatement";
  }
  export interface WithStatement extends Statement {
    // type: "WithStatement";
    object: Expression;
    body: Statement;
  }

  export interface ReturnStatement extends Statement {
    // type: "ReturnStatement";
    argument?: Expression;
  }
  export interface LabeledStatement extends Statement {
    // type: "LabeledStatement";
    label: Identifier;
    body: Statement;
  }
  export interface BreakStatement extends Statement {
    // type: "BreakStatement";
    label?: Identifier;
  }
  export interface ContinueStatement extends Statement {
    // type: "ContinueStatement";
    label?: Identifier;
  }

  export interface IfStatement extends Statement {
    // type: "IfStatement";
    test: Expression;
    consequent: Statement;
    alternate?: Statement;
  }
  export interface SwitchStatement extends Statement {
    // type: "SwitchStatement";
    discriminant: Expression;
    cases: SwitchCase[];
  }
  export interface SwitchCase extends Node {
    // type: "SwitchCase";
    test?: Expression;
    consequent: Statement[];
  }

  export interface ThrowStatement extends Statement {
    // type: "ThrowStatement";
    argument: Expression;
  }
  export interface TryStatement extends Statement {
    // type: "TryStatement";
    block: BlockStatement;
    handler?: CatchClause;
    finalizer?: BlockStatement;
  }
  export interface CatchClause extends Node {
    // type: "CatchClause";
    param: Pattern;
    body: BlockStatement;
  }

  export interface WhileStatement extends Statement {
    // type: "WhileStatement";
    test: Expression;
    body: Statement;
  }
  export interface DoWhileStatement extends Statement {
    // type: "DoWhileStatement";
    body: Statement;
    test: Expression;
  }
  export interface ForStatement extends Statement {
    // type: "ForStatement";
    init?: VariableDeclaration | Expression;
    test?: Expression;
    update?: Expression;
    body: Statement;
  }
  export interface ForInStatement extends Statement {
    // type: "ForInStatement";
    left: VariableDeclaration |  Expression;
    right: Expression;
    body: Statement;
  }
  export interface ForOfStatement extends ForInStatement {
    // type: "ForOfStatement";
  }

  export interface Declaration extends Statement { }
  export interface FunctionDeclaration extends Function, Declaration {
    // type: "FunctionDeclaration";
    id: Identifier;
  }
  export interface VariableDeclaration extends Declaration {
    // type: "VariableDeclaration";
    declarations: VariableDeclarator[];
    // kind: "var" | "let" | "const";;
    kind: string;
  }
  export interface VariableDeclarator extends Node {
    // type: "VariableDeclarator";
    id: Pattern;
    init?: Expression;
  }

  export interface Expression extends Node { }
  export interface ThisExpression extends Expression {
    // type: "ThisExpression";
  }
  export interface ArrayExpression extends Expression {
    // type: "ArrayExpression";
    elements: (Expression|SpreadElement)[];
  }

  export interface ObjectExpression extends Expression {
    // type: "ObjectExpression";
    properties: Property[];
  }
  export interface Property extends Node {
    // type: "Property";
    key: Expression;
    value: Expression;
    // kind: "init" | "get" | "set";
    kind: string;
    method: boolean;
    shorthand: boolean;
    computed: boolean;
  }
  export interface FunctionExpression extends Function, Expression {
    // type: "FunctionExpression";
  }
  export interface ArrowFunctionExpression extends Expression {
    // type: "ArrowFunctionExpression";
    params: Pattern[];
    generator?: boolean;
    body: BlockStatement | Expression;
    expression: boolean;
  }
  export interface YieldExpression extends Expression {
    // type: "YieldExpression";
    argument?: Expression;
    delegate: boolean;
  }
  export interface Super extends Node {
    // type: "Super";
  }


  export interface UnaryExpression extends Expression {
    // type: "UnaryExpression";
    operator: UnaryOperator;
    prefix: boolean;
    argument: Expression;
  }
  /**
   * One of: "-" | "+" | "!" | "~" | "typeof" | "void" | "delete";
   */
  export type UnaryOperator = string;
  export interface UpdateExpression extends Expression {
    // type: "UpdateExpression";
    operator: UpdateOperator;
    argument: Expression;
    prefix: boolean;
  }
  /**
   * One of: "++" | "--";
   */
  export type UpdateOperator = string;

  export interface BinaryExpression extends Expression {
    // type: "BinaryExpression";
    operator: BinaryOperator;
    left: Expression;
    right: Expression;
  }
  /**
   *  One of: "==" | "!=" | "===" | "!==" | "<" | "<=" | ">" | ">=" | "<<" |
   *  ">>" | ">>>" | "+" | "-" | "*" | "/" | "%" | "|" | "^" | "&" | "in" |
   *  "instanceof";
   */
  export type BinaryOperator = string;
  export interface AssignmentExpression extends Expression {
    // type: "AssignmentExpression";
    operator: AssignmentOperator;
    left: Pattern | MemberExpression;
    right: Expression;
  }
  /**
   * One of: "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "<<=" | ">>=" | ">>>=" |
   * "|=" | "^=" | "&=";
   */
  export type AssignmentOperator = string;
  export interface LogicalExpression extends Expression {
    // type: "LogicalExpression";
    operator: LogicalOperator;
    left: Expression;
    right: Expression;
  }
  /**
   * One of: "||" | "&&"
   */
  export type LogicalOperator = string;

  export interface MemberExpression extends Expression, Pattern {
    // type: "MemberExpression";
    object: Expression | Super;
    property: Expression;
    computed: boolean;
  }
  export interface ConditionalExpression extends Expression {
    // type: "ConditionalExpression";
    test: Expression;
    alternate: Expression;
    consequent: Expression;
  }
  export interface CallExpression extends Expression {
    // type: "CallExpression";
    callee: Expression | Super;
    arguments: (Expression|SpreadElement)[];
  }
  export interface NewExpression extends CallExpression {
    // type: "NewExpression";
  }
  export interface SequenceExpression extends Expression {
    // type: "SequenceExpression";
    expressions: Expression[];
  }

  export interface TemplateLiteral extends Expression {
    // type: "TemplateLiteral";
    quasis: TemplateElement[];
    expressions: Expression[];
  }
  export interface TaggedTemplateExpression extends Expression {
    // type: "TaggedTemplateExpression";
    tag: Expression;
    quasi: TemplateLiteral;
  }
  export interface TemplateElement extends Node {
    // type: "TemplateElement";
    tail: boolean;
    value: {
        cooked: string;
        raw: string;
    };
  }

  export interface SpreadElement extends Node {
    // type: "SpreadElement";
    argument: Expression;
  }

  export interface Pattern extends Node { }
  export interface AssignmentProperty extends Property {
    // type: "Property"; // inherited
    value: Pattern;
    // kind: "init";
    kind: string;
    // method: false;
    method: boolean;
  }

  export interface ObjectPattern extends Pattern {
    // type: "ObjectPattern";
    properties: AssignmentProperty[];
  }

  export interface ArrayPattern extends Pattern {
    // type: "ArrayPattern";
    elements: Pattern[];
  }
  export interface RestElement extends Pattern {
    // type: "RestElement";
    argument: Pattern;
  }
  export interface AssignmentPattern extends Pattern {
    // type: "AssignmentPattern";
    left: Pattern;
    right: Expression;
  }

  export interface Class extends Node {
    // type ???
    id?: Identifier;
    superClass?: Expression;
    body: ClassBody;
  }
  export interface ClassBody extends Node {
    // type: "ClassBody";
    body: MethodDefinition[];
  }
  export interface MethodDefinition extends Node {
    // type: "MethodDefinition";
    key: Expression;
    value: FunctionExpression;
    // kind: "constructor" | "method" | "get" | "set";
    kind: string;
    computed: boolean;
    static: boolean;
  }
  export interface ClassDeclaration extends Class, Declaration {
    // type: "ClassDeclaration";
    id: Identifier;
  }
  export interface ClassExpression extends Class, Expression {
    // type: "ClassExpression";
  }
  export interface MetaProperty extends Expression {
    // type: "MetaProperty";
    meta: Identifier;
    property: Identifier;
  }

  export interface ModuleDeclaration extends Node { }
  export interface ModuleSpecifier extends Node {
    local: Identifier;
  }

  export interface ImportDeclaration extends ModuleDeclaration {
    // type: "ImportDeclaration";
    specifiers: (ImportSpecifier|ImportDefaultSpecifier|ImportNamespaceSpecifier)[];
    source: Literal;
  }
  export interface ImportSpecifier extends ModuleSpecifier {
    // type: "ImportSpecifier";
    imported: Identifier;
  }
  export interface ImportDefaultSpecifier extends ModuleSpecifier {
    // type: "ImportDefaultSpecifier";
  }
  export interface ImportNamespaceSpecifier extends ModuleSpecifier {
    // type: "ImportNamespaceSpecifier";
  }
  export interface ExportNamedDeclaration extends ModuleDeclaration {
    // type: "ExportNamedDeclaration";
    declaration?: Declaration;
    specifiers: ExportSpecifier[];
    source?: Literal;
  }
  export interface ExportSpecifier extends ModuleSpecifier {
    // type: "ExportSpecifier";
    exported: Identifier;
  }
  export interface ExportDefaultDeclaration extends ModuleDeclaration {
    // type: "ExportDefaultDeclaration";
    declaration: Declaration | Expression;
  }
  export interface ExportAllDeclaration extends ModuleDeclaration {
    // type: "ExportAllDeclaration";
    source: Literal;
  }
}
