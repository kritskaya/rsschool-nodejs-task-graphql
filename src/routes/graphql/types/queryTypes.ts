import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { PostEntity } from '../../../utils/DB/entities/DBPosts';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { memberTypeType, postType, profileType, userType } from './basicTypes';

const userWithDataType = new GraphQLObjectType({
  name: 'userWithData',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUserIds: {
      type: new GraphQLList(GraphQLID),
    },
    profile: {
      type: profileType,
      resolve: (user, _args, context) =>
        context.profiles.findOne({ key: 'userId', equals: user.id }),
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async (user, _args, context) => {
        const allPosts = await context.posts.findMany();
        return allPosts.filter((post: PostEntity) => post.userId === user.id);
      },
    },
    memberType: {
      type: memberTypeType,
      resolve: async (user, _args, context) => {
        const profile = await context.profiles.findOne({
          key: 'userId',
          equals: user.id,
        });
        if (profile) {
          return context.memberTypes.findOne({
            key: 'id',
            equals: profile.memberTypeId,
          });
        }
        return null;
      },
    },
  }),
});

const usersWithUsersSubscribeToAndProfileType = new GraphQLObjectType({
  name: 'usersWithUsersSubscribeToAndProfile',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    usersSubscribedTo: {
      type: new GraphQLList(userType),
      resolve: async (user, _args, context) => {
        const users = await context.users.findMany();
        return users.filter((item: UserEntity) =>
          item.subscribedToUserIds.includes(user.id)
        );
      },
    },
    profile: {
      type: profileType,
      resolve: (user, _args, context) =>
        context.profiles.findOne({ key: 'userId', equals: user.id }),
    },
  }),
});

const userWithSubscribersAndPostsType = new GraphQLObjectType({
  name: 'userWithSubscribersAndPosts',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    subscribedToUsers: {
      type: new GraphQLList(userType),
      resolve: async (user, _args, context) =>
        await user.subscribedToUserIds.map((id: string) =>
          context.users.findOne({ key: 'id', equals: id })
        ),
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async (user, _args, context) => {
        const allPosts = await context.posts.findMany();
        return allPosts.filter((post: PostEntity) => post.userId === user.id);
      },
    },
  }),
});

const usersSucribedType: GraphQLObjectType = new GraphQLObjectType({
  name: 'usersSucribedType',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    usersSubscribedTo: {
      type: new GraphQLList(usersSucribedType),
      resolve: async (user, _args, context) => {
        const users = await context.users.findMany();
        return users.filter((item: UserEntity) =>
          item.subscribedToUserIds.includes(user.id)
        );
      },
    },
    subscribedToUsers: {
      type: new GraphQLList(usersSucribedType),
      resolve: async (user, _args, context) =>
        await user.subscribedToUserIds.map((id: string) =>
          context.users.findOne({ key: 'id', equals: id })
        ),
    },
  }),
});

const allEntitiesType = new GraphQLObjectType({
  name: 'allEntities',
  fields: () => ({
    users: {
      type: new GraphQLList(userType),
      resolve: (_obj, _args, context) => context.users.findMany(),
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: (_obj, _args, context) => context.posts.findMany(),
    },
    profiles: {
      type: new GraphQLList(profileType),
      resolve: (_obj, _args, context) => context.profiles.findMany(),
    },
    memberTypes: {
      type: new GraphQLList(memberTypeType),
      resolve: (_obj, _args, context) => context.memberTypes.findMany(),
    },
  }),
});

const allEntitiesByIdType = new GraphQLObjectType({
  name: 'allEntitiesById',
  fields: () => ({
    user: {
      type: userType,
      args: {
        userId: { type: GraphQLID },
      },
      resolve: (_obj, { userId }, context) =>
        context.users.findOne({ key: 'id', equals: userId }),
    },
    post: {
      type: postType,
      args: {
        postId: { type: GraphQLID },
      },
      resolve: (_obj, { postId }, context) =>
        context.posts.findOne({ key: 'id', equals: postId }),
    },
    profile: {
      type: profileType,
      args: {
        profileId: { type: GraphQLID },
      },
      resolve: (_obj, { profileId }, context) =>
        context.profiles.findOne({ key: 'id', equals: profileId }),
    },
    memberType: {
      type: memberTypeType,
      args: {
        memberTypeId: { type: GraphQLID },
      },
      resolve: (_obj, { memberTypeId }, context) =>
        context.memberTypes.findOne({ key: 'id', equals: memberTypeId }),
    },
  }),
});

export {
  userWithDataType,
  usersWithUsersSubscribeToAndProfileType,
  userWithSubscribersAndPostsType,
  usersSucribedType,
  allEntitiesType,
  allEntitiesByIdType,
};
