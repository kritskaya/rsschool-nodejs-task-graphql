import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return fastify.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!user) {
        throw fastify.httpErrors.notFound(
          'user with specified id is not found'
        );
      }

      return user;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      return fastify.db.users.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!user) {
        throw fastify.httpErrors.badRequest(
          'user with specified id is not found'
        );
      }

      const profile = await fastify.db.profiles.findOne({
        key: 'userId',
        equals: request.params.id,
      });

      if (profile) {
        fastify.db.profiles.delete(profile.id);
      }

      const posts = await fastify.db.posts.findMany();
      posts.forEach((post) => {
        if (post.userId === request.params.id) {
          fastify.db.posts.delete(post.id);
        }
      });

      const users = await fastify.db.users.findMany();
      users.forEach((item) => {
        if (item.subscribedToUserIds.includes(user.id)) {
          fastify.db.users.change(item.id, {
            ...item,
            subscribedToUserIds: [
              ...item.subscribedToUserIds.filter((id) => id !== user.id),
            ],
          });
        }
      });

      return fastify.db.users.delete(request.params.id);
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const subscribee = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!subscribee) {
        throw fastify.httpErrors.badRequest(
          'subscribee with specified id is not found'
        );
      }

      const subscribedUser = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });

      if (!subscribedUser) {
        throw fastify.httpErrors.badRequest(
          'subscribed user with specified id is not found'
        );
      }

      return fastify.db.users.change(request.body.userId, {
        ...subscribedUser,
        subscribedToUserIds: [
          ...subscribedUser.subscribedToUserIds,
          request.params.id,
        ],
      });
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const subscribee = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!subscribee) {
        throw fastify.httpErrors.badRequest(
          'subscribee with specified id is not found'
        );
      }

      const unsubscribedUser = await fastify.db.users.findOne({
        key: 'id',
        equals: request.body.userId,
      });

      if (!unsubscribedUser) {
        throw fastify.httpErrors.badRequest(
          'user with specified id is not found'
        );
      }

      if (!unsubscribedUser.subscribedToUserIds.includes(request.params.id)) {
        throw fastify.httpErrors.badRequest(
          'user is not subscribed to the specified user'
        );
      }

      return fastify.db.users.change(request.body.userId, {
        ...unsubscribedUser,
        subscribedToUserIds: [
          ...unsubscribedUser.subscribedToUserIds.filter(
            (id) => id !== request.params.id
          ),
        ],
      });
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const user = await fastify.db.users.findOne({
        key: 'id',
        equals: request.params.id,
      });

      if (!user) {
        throw fastify.httpErrors.badRequest(
          'user with specified id is not found'
        );
      }

      return fastify.db.users.change(request.params.id, request.body);
    }
  );
};

export default plugin;
