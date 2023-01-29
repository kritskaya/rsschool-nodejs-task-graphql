import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import { mutationType } from './types/mutationTypes';
import {
  allEntitiesByIdType,
  allEntitiesType,
  usersSubscriptionsType,
  usersWithUsersSubscribeToAndProfileType,
  userWithDataType,
  userWithSubscribersAndPostsType,
} from './types/queryTypes';

const queryType = new GraphQLObjectType({
  name: 'query',
  fields: () => ({
    allEntities: {
      type: allEntitiesType,
      resolve: () => '',
    },
    allEntitiesById: {
      type: allEntitiesByIdType,
      resolve: () => '',
    },
    usersWithData: {
      type: new GraphQLList(userWithDataType),
      resolve: (_obj, _args, context) => context.db.users.findMany(),
    },
    userWithDataById: {
      type: userWithDataType,
      args: {
        userId: { type: GraphQLID },
      },
      resolve: async (_obj, { userId }, context) => {
        const user = await context.db.users.findOne({ key: 'id', equals: userId });
        if (!user) {
          throw new Error('user with specified id is not found');
        }
        return user;
      },
    },
    usersWithUsersSubscribeToAndProfile: {
      type: new GraphQLList(usersWithUsersSubscribeToAndProfileType),
      resolve: (_obj, _args, context) => context.db.users.findMany(),
    },
    userWithSubscribersAndPosts: {
      type: userWithSubscribersAndPostsType,
      args: {
        userId: { type: GraphQLID },
      },
      resolve: async (_obj, { userId }, context) => {
        const user = await context.db.users.findOne({ key: 'id', equals: userId })
        if (!user) {
          throw new Error('user with specified id is not found');
        }
        return user;
      }
    },
    usersSubscribtions: {
      type: new GraphQLList(usersSubscriptionsType),
      resolve: (_obj, _args, context) => context.db.users.findMany(),
    },
  }),
});

const schema = new GraphQLSchema({ query: queryType, mutation: mutationType });

export { schema };
