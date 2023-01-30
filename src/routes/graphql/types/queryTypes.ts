import {
  GraphQLID,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
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
        // CODE BEFORE USING DATA LOADER
        // const profile = await context.db.profiles.findOne({
        //   key: 'userId',
        //   equals: user.id,
        // });
        // return profile;
        const profile = await context.loaders.profiles.load(user.id);
        return profile;
      },
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async (user, _args, context) => {
        // CODE BEFORE USING DATA LOADER
        // const allPosts = await context.db.posts.findMany();
        // return allPosts.filter((post: PostEntity) => post.userId === user.id);
        const posts = await context.loaders.posts.load(user.id);
        return posts;
      },
    },
    memberType: {
      type: memberTypeType,
      resolve: async (user, _args, context) => {
        // CODE BEFORE USING DATA LOADER
        // const profile = await context.db.profiles.findOne({
        //   key: 'userId',
        //   equals: user.id,
        // });

        // let memberType = null;
        // if (profile) {
        //   memberType = await context.db.memberTypes.findOne({
        //     key: 'id',
        //     equals: profile.memberTypeId || '',
        //   });
        // }

        // return memberType;

        const profile = await context.loaders.profiles.load(user.id);

        let memberType = null;
        if (profile) {
          memberType = await context.loaders.memberTypes.load(
            profile.memberTypeId
          );
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
        // CODE BEFORE USING DATA LOADER
        // const users = await context.db.users.findMany();
        // return users.filter((item: UserEntity) =>
        //   item.subscribedToUserIds.includes(user.id)
        // );
        const subscriptions = await context.loaders.subscribedToUser.load(
          user.id
        );
        return subscriptions;
      },
    },
    profile: {
      type: profileType,
      resolve: async (user, _args, context) => {
        // CODE BEFORE USING DATA LOADER
        // const profile = await context.db.profiles.findOne({
        //   key: 'userId',
        //   equals: user.id,
        // });
        // return profile;
        const profile = await context.loaders.profiles.load(user.id);
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
      resolve: async (user, _args, context) => {
        // CODE BEFORE USING DATA LOADER
        // await user.subscribedToUserIds.map((id: string) =>
        //   context.db.users.findOne({ key: 'id', equals: id })
        // ),
        const subscribedToUsers = await context.loaders.users.loadMany(
          user.subscribedToUserIds
        );
        return subscribedToUsers;
      },
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: async (user, _args, context) => {
        // CODE BEFORE USING DATA LOADER
        // const allPosts = await context.db.posts.findMany();
        // return allPosts.filter((post: PostEntity) => post.userId === user.id);
        const posts = await context.loaders.posts.load(user.id);
        return posts;
      },
    },
  }),
});

const usersSubscriptionsType: GraphQLObjectType = new GraphQLObjectType({
  name: 'usersSubscriptions',
  fields: () => ({
    id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    usersSubscribedTo: {
      type: new GraphQLList(usersSubscriptionsType),
      resolve: async (user, _args, context) => {
        // CODE BEFORE USING DATA LOADER
        // const users = await context.db.users.findMany();
        // return users.filter((item: UserEntity) =>
        //   item.subscribedToUserIds.includes(user.id)
        // );
        const subscriptions = await context.loaders.subscribedToUser.load(
          user.id
        );
        return subscriptions;
      },
    },
    subscribedToUser: {
      type: new GraphQLList(usersSubscriptionsType),
      resolve: async (user, _args, context) => {
        // CODE BEFORE USING DATA LOADER
        // await user.subscribedToUserIds.map((id: string) =>
        //   context.db.users.findOne({ key: 'id', equals: id })
        // ),
        const subscribedToUser = await context.loaders.users.loadMany(
          user.subscribedToUserIds
        );
        return subscribedToUser;
      }
    },
  }),
});

const allEntitiesType = new GraphQLObjectType({
  name: 'allEntities',
  fields: () => ({
    users: {
      type: new GraphQLList(userType),
      resolve: (_obj, _args, context) => context.db.users.findMany(),
    },
    posts: {
      type: new GraphQLList(postType),
      resolve: (_obj, _args, context) => context.db.posts.findMany(),
    },
    profiles: {
      type: new GraphQLList(profileType),
      resolve: (_obj, _args, context) => context.db.profiles.findMany(),
    },
    memberTypes: {
      type: new GraphQLList(memberTypeType),
      resolve: (_obj, _args, context) => context.db.memberTypes.findMany(),
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
        const user = await context.db.users.findOne({
          key: 'id',
          equals: userId,
        });
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
        const post = await context.db.posts.findOne({
          key: 'id',
          equals: postId,
        });
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
        const profile = await context.db.profiles.findOne({
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
        const memberType = await context.db.memberTypes.findOne({
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
  usersSubscriptionsType,
  allEntitiesType,
  allEntitiesByIdType,
};
