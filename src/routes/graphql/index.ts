import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql } from 'graphql';
import { graphqlBodySchema } from './schema';
import { schema } from './graphql.schema';
import { createLoaders } from './dataloader/dataloader';

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
