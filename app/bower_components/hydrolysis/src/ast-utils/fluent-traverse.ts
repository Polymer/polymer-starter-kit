import * as estree from 'estree';

export interface Visitor {
  classDetected?: boolean,

  enterIdentifier?: (node: estree.Identifier, parent: estree.Node)=>void;
  leaveIdentifier?: (node: estree.Identifier, parent: estree.Node)=>void;

  enterLiteral?: (node: estree.Literal, parent: estree.Node)=>void;
  leaveLiteral?: (node: estree.Literal, parent: estree.Node)=>void;

  enterProgram?: (node: estree.Program, parent: estree.Node)=>void;
  leaveProgram?: (node: estree.Program, parent: estree.Node)=>void;

  enterExpressionStatement?: (node: estree.ExpressionStatement, parent: estree.Node)=>void;
  leaveExpressionStatement?: (node: estree.ExpressionStatement, parent: estree.Node)=>void;

  enterBlockStatement?: (node: estree.BlockStatement, parent: estree.Node)=>void;
  leaveBlockStatement?: (node: estree.BlockStatement, parent: estree.Node)=>void;

  enterEmptyStatement?: (node: estree.EmptyStatement, parent: estree.Node)=>void;
  leaveEmptyStatement?: (node: estree.EmptyStatement, parent: estree.Node)=>void;

  enterDebuggerStatement?: (node: estree.DebuggerStatement, parent: estree.Node)=>void;
  leaveDebuggerStatement?: (node: estree.DebuggerStatement, parent: estree.Node)=>void;

  enterWithStatement?: (node: estree.WithStatement, parent: estree.Node)=>void;
  leaveWithStatement?: (node: estree.WithStatement, parent: estree.Node)=>void;

  enterReturnStatement?: (node: estree.ReturnStatement, parent: estree.Node)=>void;
  leaveReturnStatement?: (node: estree.ReturnStatement, parent: estree.Node)=>void;

  enterLabeledStatement?: (node: estree.LabeledStatement, parent: estree.Node)=>void;
  leaveLabeledStatement?: (node: estree.LabeledStatement, parent: estree.Node)=>void;

  enterBreakStatement?: (node: estree.BreakStatement, parent: estree.Node)=>void;
  leaveBreakStatement?: (node: estree.BreakStatement, parent: estree.Node)=>void;

  enterContinueStatement?: (node: estree.ContinueStatement, parent: estree.Node)=>void;
  leaveContinueStatement?: (node: estree.ContinueStatement, parent: estree.Node)=>void;

  enterIfStatement?: (node: estree.IfStatement, parent: estree.Node)=>void;
  leaveIfStatement?: (node: estree.IfStatement, parent: estree.Node)=>void;

  enterSwitchStatement?: (node: estree.SwitchStatement, parent: estree.Node)=>void;
  leaveSwitchStatement?: (node: estree.SwitchStatement, parent: estree.Node)=>void;

  enterSwitchCase?: (node: estree.SwitchCase, parent: estree.Node)=>void;
  leaveSwitchCase?: (node: estree.SwitchCase, parent: estree.Node)=>void;

  enterThrowStatement?: (node: estree.ThrowStatement, parent: estree.Node)=>void;
  leaveThrowStatement?: (node: estree.ThrowStatement, parent: estree.Node)=>void;

  enterTryStatement?: (node: estree.TryStatement, parent: estree.Node)=>void;
  leaveTryStatement?: (node: estree.TryStatement, parent: estree.Node)=>void;

  enterCatchClause?: (node: estree.CatchClause, parent: estree.Node)=>void;
  leaveCatchClause?: (node: estree.CatchClause, parent: estree.Node)=>void;

  enterWhileStatement?: (node: estree.WhileStatement, parent: estree.Node)=>void;
  leaveWhileStatement?: (node: estree.WhileStatement, parent: estree.Node)=>void;

  enterDoWhileStatement?: (node: estree.DoWhileStatement, parent: estree.Node)=>void;
  leaveDoWhileStatement?: (node: estree.DoWhileStatement, parent: estree.Node)=>void;

  enterForStatement?: (node: estree.ForStatement, parent: estree.Node)=>void;
  leaveForStatement?: (node: estree.ForStatement, parent: estree.Node)=>void;

  enterForInStatement?: (node: estree.ForInStatement, parent: estree.Node)=>void;
  leaveForInStatement?: (node: estree.ForInStatement, parent: estree.Node)=>void;

  enterForOfStatement?: (node: estree.ForOfStatement, parent: estree.Node)=>void;
  leaveForOfStatement?: (node: estree.ForOfStatement, parent: estree.Node)=>void;

  enterFunctionDeclaration?: (node: estree.FunctionDeclaration, parent: estree.Node)=>void;
  leaveFunctionDeclaration?: (node: estree.FunctionDeclaration, parent: estree.Node)=>void;

  enterVariableDeclaration?: (node: estree.VariableDeclaration, parent: estree.Node)=>void;
  leaveVariableDeclaration?: (node: estree.VariableDeclaration, parent: estree.Node)=>void;

  enterVariableDeclarator?: (node: estree.VariableDeclarator, parent: estree.Node)=>void;
  leaveVariableDeclarator?: (node: estree.VariableDeclarator, parent: estree.Node)=>void;

  enterThisExpression?: (node: estree.ThisExpression, parent: estree.Node)=>void;
  leaveThisExpression?: (node: estree.ThisExpression, parent: estree.Node)=>void;

  enterArrayExpression?: (node: estree.ArrayExpression, parent: estree.Node)=>void;
  leaveArrayExpression?: (node: estree.ArrayExpression, parent: estree.Node)=>void;

  enterObjectExpression?: (node: estree.ObjectExpression, parent: estree.Node)=>void;
  leaveObjectExpression?: (node: estree.ObjectExpression, parent: estree.Node)=>void;

  enterProperty?: (node: estree.Property, parent: estree.Node)=>void;
  leaveProperty?: (node: estree.Property, parent: estree.Node)=>void;

  enterFunctionExpression?: (node: estree.FunctionExpression, parent: estree.Node)=>void;
  leaveFunctionExpression?: (node: estree.FunctionExpression, parent: estree.Node)=>void;

  enterArrowFunctionExpression?: (node: estree.ArrowFunctionExpression, parent: estree.Node)=>void;
  leaveArrowFunctionExpression?: (node: estree.ArrowFunctionExpression, parent: estree.Node)=>void;

  enterYieldExpression?: (node: estree.YieldExpression, parent: estree.Node)=>void;
  leaveYieldExpression?: (node: estree.YieldExpression, parent: estree.Node)=>void;

  enterSuper?: (node: estree.Super, parent: estree.Node)=>void;
  leaveSuper?: (node: estree.Super, parent: estree.Node)=>void;

  enterUnaryExpression?: (node: estree.UnaryExpression, parent: estree.Node)=>void;
  leaveUnaryExpression?: (node: estree.UnaryExpression, parent: estree.Node)=>void;

  enterUpdateExpression?: (node: estree.UpdateExpression, parent: estree.Node)=>void;
  leaveUpdateExpression?: (node: estree.UpdateExpression, parent: estree.Node)=>void;

  enterBinaryExpression?: (node: estree.BinaryExpression, parent: estree.Node)=>void;
  leaveBinaryExpression?: (node: estree.BinaryExpression, parent: estree.Node)=>void;

  enterAssignmentExpression?: (node: estree.AssignmentExpression, parent: estree.Node)=>void;
  leaveAssignmentExpression?: (node: estree.AssignmentExpression, parent: estree.Node)=>void;

  enterLogicalExpression?: (node: estree.LogicalExpression, parent: estree.Node)=>void;
  leaveLogicalExpression?: (node: estree.LogicalExpression, parent: estree.Node)=>void;

  enterMemberExpression?: (node: estree.MemberExpression, parent: estree.Node)=>void;
  leaveMemberExpression?: (node: estree.MemberExpression, parent: estree.Node)=>void;

  enterConditionalExpression?: (node: estree.ConditionalExpression, parent: estree.Node)=>void;
  leaveConditionalExpression?: (node: estree.ConditionalExpression, parent: estree.Node)=>void;

  enterCallExpression?: (node: estree.CallExpression, parent: estree.Node)=>void;
  leaveCallExpression?: (node: estree.CallExpression, parent: estree.Node)=>void;

  enterNewExpression?: (node: estree.NewExpression, parent: estree.Node)=>void;
  leaveNewExpression?: (node: estree.NewExpression, parent: estree.Node)=>void;

  enterSequenceExpression?: (node: estree.SequenceExpression, parent: estree.Node)=>void;
  leaveSequenceExpression?: (node: estree.SequenceExpression, parent: estree.Node)=>void;

  enterTemplateLiteral?: (node: estree.TemplateLiteral, parent: estree.Node)=>void;
  leaveTemplateLiteral?: (node: estree.TemplateLiteral, parent: estree.Node)=>void;

  enterTaggedTemplateExpression?: (node: estree.TaggedTemplateExpression, parent: estree.Node)=>void;
  leaveTaggedTemplateExpression?: (node: estree.TaggedTemplateExpression, parent: estree.Node)=>void;

  enterTemplateElement?: (node: estree.TemplateElement, parent: estree.Node)=>void;
  leaveTemplateElement?: (node: estree.TemplateElement, parent: estree.Node)=>void;

  enterSpreadElement?: (node: estree.SpreadElement, parent: estree.Node)=>void;
  leaveSpreadElement?: (node: estree.SpreadElement, parent: estree.Node)=>void;

  enterPattern?: (node: estree.Pattern, parent: estree.Node)=>void;
  leavePattern?: (node: estree.Pattern, parent: estree.Node)=>void;

  enterAssignmentProperty?: (node: estree.AssignmentProperty, parent: estree.Node)=>void;
  leaveAssignmentProperty?: (node: estree.AssignmentProperty, parent: estree.Node)=>void;

  enterObjectPattern?: (node: estree.ObjectPattern, parent: estree.Node)=>void;
  leaveObjectPattern?: (node: estree.ObjectPattern, parent: estree.Node)=>void;

  enterArrayPattern?: (node: estree.ArrayPattern, parent: estree.Node)=>void;
  leaveArrayPattern?: (node: estree.ArrayPattern, parent: estree.Node)=>void;

  enterRestElement?: (node: estree.RestElement, parent: estree.Node)=>void;
  leaveRestElement?: (node: estree.RestElement, parent: estree.Node)=>void;

  enterAssignmentPattern?: (node: estree.AssignmentPattern, parent: estree.Node)=>void;
  leaveAssignmentPattern?: (node: estree.AssignmentPattern, parent: estree.Node)=>void;

  enterMethodDefinition?: (node: estree.MethodDefinition, parent: estree.Node)=>void;
  leaveMethodDefinition?: (node: estree.MethodDefinition, parent: estree.Node)=>void;

  enterClassDeclaration?: (node: estree.ClassDeclaration, parent: estree.Node)=>void;
  leaveClassDeclaration?: (node: estree.ClassDeclaration, parent: estree.Node)=>void;

  enterClassExpression?: (node: estree.ClassExpression, parent: estree.Node)=>void;
  leaveClassExpression?: (node: estree.ClassExpression, parent: estree.Node)=>void;

  enterMetaProperty?: (node: estree.MetaProperty, parent: estree.Node)=>void;
  leaveMetaProperty?: (node: estree.MetaProperty, parent: estree.Node)=>void;

  enterModuleDeclaration?: (node: estree.ModuleDeclaration, parent: estree.Node)=>void;
  leaveModuleDeclaration?: (node: estree.ModuleDeclaration, parent: estree.Node)=>void;

  enterModuleSpecifier?: (node: estree.ModuleSpecifier, parent: estree.Node)=>void;
  leaveModuleSpecifier?: (node: estree.ModuleSpecifier, parent: estree.Node)=>void;

  enterImportDeclaration?: (node: estree.ImportDeclaration, parent: estree.Node)=>void;
  leaveImportDeclaration?: (node: estree.ImportDeclaration, parent: estree.Node)=>void;

  enterImportSpecifier?: (node: estree.ImportSpecifier, parent: estree.Node)=>void;
  leaveImportSpecifier?: (node: estree.ImportSpecifier, parent: estree.Node)=>void;

  enterImportDefaultSpecifier?: (node: estree.ImportDefaultSpecifier, parent: estree.Node)=>void;
  leaveImportDefaultSpecifier?: (node: estree.ImportDefaultSpecifier, parent: estree.Node)=>void;

  enterImportNamespaceSpecifier?: (node: estree.ImportNamespaceSpecifier, parent: estree.Node)=>void;
  leaveImportNamespaceSpecifier?: (node: estree.ImportNamespaceSpecifier, parent: estree.Node)=>void;

  enterExportNamedDeclaration?: (node: estree.ExportNamedDeclaration, parent: estree.Node)=>void;
  leaveExportNamedDeclaration?: (node: estree.ExportNamedDeclaration, parent: estree.Node)=>void;

  enterExportSpecifier?: (node: estree.ExportSpecifier, parent: estree.Node)=>void;
  leaveExportSpecifier?: (node: estree.ExportSpecifier, parent: estree.Node)=>void;

  enterExportDefaultDeclaration?: (node: estree.ExportDefaultDeclaration, parent: estree.Node)=>void;
  leaveExportDefaultDeclaration?: (node: estree.ExportDefaultDeclaration, parent: estree.Node)=>void;

  enterExportAllDeclaration?: (node: estree.ExportAllDeclaration, parent: estree.Node)=>void;
  leaveExportAllDeclaration?: (node: estree.ExportAllDeclaration, parent: estree.Node)=>void;
}
