module.exports = function ({ types }) {
  return {
    visitor: {
      MemberExpression(path) {
        const node = path.node;
        if (types.isIdentifier(node.property, { name: 'BASE_URL' }) && types.isMemberExpression(node.object) && types.isIdentifier(node.object.property, { name: 'env' }) && types.isMetaProperty(node.object.object)) {
          path.replaceWith(types.stringLiteral('/'));
        }
      },
    },
  };
};
