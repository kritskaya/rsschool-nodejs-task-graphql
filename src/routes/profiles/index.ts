import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    return fastify.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!profile) {
        throw fastify.httpErrors.notFound(
          'profile with specified id is not found'
        );
      }

      return profile;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });

      if (!user) {
        throw fastify.httpErrors.badRequest(
          'user with specified id is not found'
        );
      }

      const memberType = await fastify.db.memberTypes.findOne({
        key: 'id',
        equals: request.body.memberTypeId,
      });

      if (!memberType) {
        throw fastify.httpErrors.badRequest(
          'member type with specified id is not found'
        );
      }

      const profile = await fastify.db.profiles.findOne({
        key: 'userId',
        equals: request.body.userId,
      });

      if (profile) {
        throw fastify.httpErrors.badRequest('user already has a profile');
      }

      return fastify.db.profiles.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!profile) {
        throw fastify.httpErrors.badRequest(
          'profile with specified id is not found'
        );
      }
      
      return fastify.db.profiles.delete(request.params.id);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const profile = await fastify.db.profiles.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!profile) {
        throw fastify.httpErrors.badRequest(
          'profile with specified id is not found'
        );
      }

      // if (request.body.memberTypeId) {
      //   const memberType = await fastify.db.memberTypes.findOne({
      //     key: 'id',
      //     equals: request.body.memberTypeId,
      //   });

      //   if (!memberType) {
      //     throw fastify.httpErrors.badRequest(
      //       'member type with specified id is not found'
      //     );
      //   }
      // }

      return fastify.db.profiles.change(request.params.id, request.body);
    }
  );
};

export default plugin;
