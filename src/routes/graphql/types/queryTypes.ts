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
      resolve: async (user, _args, context) => {
        const profile = await context.profiles.findOne({
          key: 'userId',
          equals: user.id,
        });
        return profile;
      },
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

        let memberType = null;
        if (profile) {
          memberType = await context.memberTypes.findOne({
            key: 'id',
            equals: profile.memberTypeId || '',
          });
        }

        return memberType;
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
      resolve: async (user, _args, context) => {
        const profile = await context.profiles.findOne({
          key: 'userId',
          equals: user.id,
        });
        return profile;
      },
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

const usersSubcribedType: GraphQLObjectType = new GraphQLObjectType({
  name: 'usersSubcribedType',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    usersSubscribedTo: {
      type: new GraphQLList(usersSubcribedType),
      resolve: async (user, _args, context) => {
        const users = await context.users.findMany();
        return users.filter((item: UserEntity) =>
          item.subscribedToUserIds.includes(user.id)
        );
      },
    },
    subscribedToUsers: {
      type: new GraphQLList(usersSubcribedType),
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
      resolve: async (_obj, { userId }, context) => {
        const user = await context.users.findOne({ key: 'id', equals: userId });
        if (!user) {
          throw new Error('user with specified id is not found');
        }
        return user;
      },
    },
    post: {
      type: postType,
      args: {
        postId: { type: GraphQLID },
      },
      resolve: async (_obj, { postId }, context) => {
        const post = await context.posts.findOne({ key: 'id', equals: postId });
        if (!post) {
          throw new Error('post with specified id is not found');
        }
        return post;
      },
    },
    profile: {
      type: profileType,
      args: {
        profileId: { type: GraphQLID },
      },
      resolve: async (_obj, { profileId }, context) => {
        const profile = await context.profiles.findOne({
          key: 'id',
          equals: profileId,
        });
        if (!profile) {
          throw new Error('profile with specified id is not found');
        }
        return profile;
      },
    },
    memberType: {
      type: memberTypeType,
      args: {
        memberTypeId: { type: GraphQLID },
      },
      resolve: async (_obj, { memberTypeId }, context) => {
        const memberType = await context.memberTypes.findOne({
          key: 'id',
          equals: memberTypeId,
        });
        if (!memberType) {
          throw new Error('memberType with specified id is not found');
        }
        return memberType;
      },
    },
  }),
});

export {
  userWithDataType,
  usersWithUsersSubscribeToAndProfileType,
  userWithSubscribersAndPostsType,
  usersSubcribedType,
  allEntitiesType,
  allEntitiesByIdType,
};
