import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphql } from 'graphql';
import { graphqlBodySchema } from './schema';
import { schema } from './graphql.schema';

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
      const source = request.body.query || "";
      const contextValue = fastify.db;
      const variableValues = request.body.variables;
      const result = await graphql({ schema, source, contextValue, variableValues });
      console.log(result);
      return result;
    }
  );
};

export default plugin;
