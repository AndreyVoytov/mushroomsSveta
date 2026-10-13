const fs = require('fs');
const path = require('path');
const ts = require('typescript');

const root = path.resolve(__dirname, '../..');

// Read data literals from the game's TypeScript without executing game code.
function readStaticConfig(relativePath, propertyName) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  const file = ts.createSourceFile(relativePath, source, ts.ScriptTarget.Latest, true);
  let initializer;
  function find(node) {
    if (ts.isPropertyDeclaration(node) && node.name.getText(file).replace(/['"]/g, '') === propertyName) initializer = node.initializer;
    if (!initializer) ts.forEachChild(node, find);
  }
  function value(node) {
    if (!node) return null;
    if (ts.isObjectLiteralExpression(node)) {
      const result = {};
      node.properties.forEach(prop => {
        if (ts.isPropertyAssignment(prop)) result[prop.name.getText(file).replace(/^['"]|['"]$/g, '')] = value(prop.initializer);
      });
      return result;
    }
    if (ts.isArrayLiteralExpression(node)) return node.elements.map(value);
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
    if (ts.isNumericLiteral(node)) return Number(node.text);
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    if (node.kind === ts.SyntaxKind.NullKeyword) return null;
    if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken) return -Number(node.operand.text);
    return node.getText(file);
  }
  find(file);
  if (!initializer) throw new Error(`Missing ${propertyName} in ${relativePath}`);
  return value(initializer);
}

module.exports = { readStaticConfig, root };
