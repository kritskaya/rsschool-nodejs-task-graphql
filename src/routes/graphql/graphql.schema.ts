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
  usersSubcribedType,
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
      resolve: (_obj, _args, context) => context.users.findMany(),
    },
    userWithDataById: {
      type: userWithDataType,
      args: {
        userId: { type: GraphQLID },
      },
      resolve: async (_obj, { userId }, context) => {
        const user = await context.users.findOne({ key: 'id', equals: userId });
        if (!user) {
          throw new Error('user with specified id is not found');
        }
        return user;
      },
    },
    usersWithUsersSubscribeToAndProfile: {
      type: new GraphQLList(usersWithUsersSubscribeToAndProfileType),
      resolve: (_obj, _args, context) => context.users.findMany(),
    },
    userWithSubscribersAndPosts: {
      type: userWithSubscribersAndPostsType,
      args: {
        userId: { type: GraphQLID },
      },
      resolve: async (_obj, { userId }, context) => {
        const user = await context.users.findOne({ key: 'id', equals: userId })
        if (!user) {
          throw new Error('user with specified id is not found');
        }
        return user;
      }
    },
    usersSubscribed: {
      type: new GraphQLList(usersSubcribedType),
      resolve: (_obj, _args, context) => context.users.findMany(),
    },
  }),
});

const schema = new GraphQLSchema({ query: queryType, mutation: mutationType });

export { schema };
