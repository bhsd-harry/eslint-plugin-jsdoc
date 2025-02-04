import iterateJsdoc from '../iterateJsdoc';

export default iterateJsdoc(({
  context,
  report,
  settings,
  utils,
}) => {
  const {
    defaultDestructuredRootDescription = 'The root object',
    setDefaultDestructuredRootDescription = false,
    exceptions = [],
  } = context.options[0] || {};

  const functionParameterNames = utils.getFunctionParameterNames();

  let rootCount = -1;
  utils.forEachPreferredTag('param', (jsdocParameter, targetTagName) => {
    rootCount += jsdocParameter.name.includes('.') ? 0 : 1;
    if (!jsdocParameter.description.trim()) {
      if (Array.isArray(functionParameterNames[rootCount])) {
        if (settings.exemptDestructuredRootsFromChecks) {
          return;
        }

        if (setDefaultDestructuredRootDescription) {
          utils.reportJSDoc(`Missing root description for @${targetTagName}.`, jsdocParameter, () => {
            utils.changeTag(jsdocParameter, {
              description: defaultDestructuredRootDescription,
              postName: ' ',
            });
          });
          return;
        }
      } else if (exceptions.includes(jsdocParameter.name)) {
        return;
      }

      report(
        `Missing JSDoc @${targetTagName} "${jsdocParameter.name}" description.`,
        null,
        jsdocParameter,
      );
    }
  });
}, {
  contextDefaults: true,
  meta: {
    docs: {
      description: 'Requires that each `@param` tag has a `description` value.',
      url: 'https://github.com/gajus/eslint-plugin-jsdoc#eslint-plugin-jsdoc-rules-require-param-description',
    },
    fixable: 'code',
    schema: [
      {
        additionalProperties: false,
        properties: {
          contexts: {
            items: {
              anyOf: [
                {
                  type: 'string',
                },
                {
                  additionalProperties: false,
                  properties: {
                    comment: {
                      type: 'string',
                    },
                    context: {
                      type: 'string',
                    },
                  },
                  type: 'object',
                },
              ],
            },
            type: 'array',
          },
          defaultDestructuredRootDescription: {
            type: 'string',
          },
          exceptions: {
            items: {
              type: 'string',
            },
            type: 'array',
          },
          setDefaultDestructuredRootDescription: {
            type: 'boolean',
          },
        },
        type: 'object',
      },
    ],
    type: 'suggestion',
  },
});
