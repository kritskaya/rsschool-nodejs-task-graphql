import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql, parse, validate } from 'graphql';
import { graphqlBodySchema } from './schema';
import { schema } from './graphql.schema';
import { createLoaders } from './dataloader/dataloader';
import depthLimit = require('graphql-depth-limit');

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request, reply) {
      const source = request.body.query || request.body.mutation || '';
      const contextValue = {
        db: fastify.db,
        loaders: createLoaders(fastify.db),
      };
      const variableValues = request.body.variables;

      const QUERY_DEPTH_LIMIT = 6;
      const errors = validate(schema, parse(source), [
        depthLimit(QUERY_DEPTH_LIMIT),
      ]);

      if (errors.length > 0) {
        return {
          errors: {
            message: `query exceeds maximum operation depth of ${QUERY_DEPTH_LIMIT}`,
          },
          data: null,
        };
      }

      const result = await graphql({
        schema,
        source,
        contextValue,
        variableValues,
      });
      return result;
    }
  );
};

export default plugin;
