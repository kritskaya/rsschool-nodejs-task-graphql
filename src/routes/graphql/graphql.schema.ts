import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
import { userType } from './types/basicTypes';
import { mutationType } from './types/mutationTypes';
import {
  allEntitiesByIdType,
  allEntitiesType,
  usersSucribedType,
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
    user: {
      type: userType,
      args: {
        userId: { type: GraphQLID },
      },
      resolve: (_obj, { userId }, context) =>
        context.users.findOne({ key: 'id', equals: userId }),
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
      resolve: (_obj, { userId }, context) =>
        context.users.findOne({ key: 'id', equals: userId }),
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
      resolve: (_obj, { userId }, context) =>
        context.users.findOne({ key: 'id', equals: userId }),
    },
    usersSubscribed: {
      type: new GraphQLList(usersSucribedType),
      resolve: (_obj, _args, context) => context.users.findMany(),
    },
  }),
});

const schema = new GraphQLSchema({ query: queryType, mutation: mutationType });

export { schema };
