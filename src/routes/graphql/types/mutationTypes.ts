import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { memberTypeType, postType, profileType, userType } from './basicTypes';

const createUserInputType = new GraphQLInputObjectType({
  name: 'createUserInput',
  fields: () => ({
    firstName: { type: new GraphQLNonNull(GraphQLString) },
    lastName: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const updateUserInputType = new GraphQLInputObjectType({
  name: 'updateUserInput',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
  }),
});

const createProfileInputType = new GraphQLInputObjectType({
  name: 'createProfileInput',
  fields: () => ({
    avatar: { type: new GraphQLNonNull(GraphQLString) },
    sex: { type: new GraphQLNonNull(GraphQLString) },
    birthday: { type: new GraphQLNonNull(GraphQLInt) },
    country: { type: new GraphQLNonNull(GraphQLString) },
    street: { type: new GraphQLNonNull(GraphQLString) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    memberTypeId: { type: new GraphQLNonNull(GraphQLID) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  }),
});

const updateProfileInputType = new GraphQLInputObjectType({
  name: 'updateProfileInput',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    avatar: { type: GraphQLString },
    sex: { type: GraphQLString },
    birthday: { type: GraphQLInt },
    country: { type: GraphQLString },
    street: { type: GraphQLString },
    city: { type: GraphQLString },
    memberTypeId: { type: GraphQLID },
  }),
});

const createPostInputType = new GraphQLInputObjectType({
  name: 'createPostInput',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLID) },
  }),
});

const updatePostInputType = new GraphQLInputObjectType({
  name: 'updatePostInput',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});

const updateMemberTypeInputType = new GraphQLInputObjectType({
  name: 'updateMemberTypeInput',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLString) },
    discount: { type: GraphQLInt },
    monthPostsLimit: { type: GraphQLInt },
  }),
});

const subscribingInputType = new GraphQLInputObjectType({
  name: 'subscribingInput',
  fields: () => ({
    userId: { type: new GraphQLNonNull(GraphQLString) },
    subscribeToId: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

const mutationType = new GraphQLObjectType({
  name: 'mutation',
  fields: () => ({
    createUser: {
      type: userType,
      args: {
        userData: { type: createUserInputType },
      },
      resolve: (_obj, args, context) =>
        context.db.users.create({
          firstName: args.userData.firstName,
          lastName: args.userData.lastName,
          email: args.userData.email,
        }),
    },
    createProfile: {
      type: profileType,
      args: {
        profileData: { type: createProfileInputType },
      },
      resolve: async (_obj, args, context) => {
        const profile = await context.db.profiles.findOne({
          key: 'id',
          equals: args.profileData.id,
        });
        if (profile) {
          throw new Error('profile for this user already exists');
        }

        const user = await context.db.users.findOne({
          key: 'id',
          equals: args.profileData.userId,
        });
        if (!user) {
          throw new Error('user with specified id is not found');
        }

        const memberType = await context.db.memberTypes.findOne({
          key: 'id',
          equals: args.profileData.memberTypeId,
        });
        if (!memberType) {
          throw new Error('memberType with specified id is not found');
        }

        return context.db.profiles.create({
          avatar: args.profileData.avatar,
          sex: args.profileData.sex,
          birthday: args.profileData.birthday,
          country: args.profileData.country,
          street: args.profileData.street,
          city: args.profileData.city,
          memberTypeId: args.profileData.memberTypeId,
          userId: args.profileData.userId,
        });
      },
    },
    createPost: {
      type: postType,
      args: {
        postData: { type: createPostInputType },
      },
      resolve: async (_obj, args, context) => {
        const user = await context.db.users.findOne({
          key: 'id',
          equals: args.postData.userId,
        });
        if (!user) {
          throw new Error('user with specified id is not found');
        }

        return context.db.posts.create({
          title: args.postData.title,
          content: args.postData.content,
          userId: args.postData.userId,
        });
      },
    },
    updateUser: {
      type: userType,
      args: {
        userData: { type: updateUserInputType },
      },
      resolve: async (_obj, args, context) => {
        const user = await context.db.users.findOne({
          key: 'id',
          equals: args.userData.id,
        });
        if (!user) {
          throw new Error('user with specified id is not found');
        }

        return context.db.users.change(args.userData.id, {
          ...user,
          firstName: args.userData.firstName || user.firstName,
          lastName: args.userData.lastName || user.lastName,
          email: args.userData.email || user.email,
        });
      },
    },
    updateProfile: {
      type: profileType,
      args: {
        profileData: { type: updateProfileInputType },
      },
      resolve: async (_obj, args, context) => {
        const profile = await context.db.profiles.findOne({
          key: 'id',
          equals: args.profileData.id,
        });
        if (!profile) {
          throw new Error('profile with specified id is not found');
        }

        const memberType = await context.db.memberTypes.findOne({
          key: 'id',
          equals: args.profileData.memberTypeId,
        });
        if (!memberType) {
          throw new Error('memberType with specified id is not found');
        }

        return context.db.profiles.change(args.profileData.id, {
          ...profile,
          avatar: args.profileData.avatar || profile.avatar,
          sex: args.profileData.sex || profile.sex,
          birthday: args.profileData.birthday || profile.birthday,
          country: args.profileData.country || profile.country,
          street: args.profileData.street || profile.street,
          city: args.profileData.city || profile.city,
          memberTypeId: args.profileData.memberTypeId || profile.memberTypeId,
        });
      },
    },
    updatePost: {
      type: postType,
      args: {
        postData: { type: updatePostInputType },
      },
      resolve: async (_obj, args, context) => {
        const post = await context.db.posts.findOne({
          key: 'id',
          equals: args.postData.id,
        });
        if (!post) {
          throw new Error('post with specified id is not found');
        }

        return context.db.posts.change(args.postData.id, {
          ...post,
          title: args.postData.title || post.title,
          content: args.postData.content || post.content,
        });
      },
    },
    updateMemberType: {
      type: memberTypeType,
      args: {
        memberTypeData: { type: updateMemberTypeInputType },
      },
      resolve: async (_obj, args, context) => {
        const memberType = await context.db.memberTypes.findOne({
          key: 'id',
          equals: args.memberTypeData.id,
        });
        if (!memberType) {
          throw new Error('memberType with specified id is not found');
        }

        return context.db.memberTypes.change(args.memberTypeData.id, {
          ...memberType,
          discount: args.memberTypeData.discount || memberType.discount,
          monthPostsLimit:
            args.memberTypeData.monthPostsLimit || memberType.monthPostsLimit,
        });
      },
    },
    subscribedToUsers: {
      type: userType,
      args: {
        subscribingData: { type: subscribingInputType },
      },
      resolve: async (_obj, args, context) => {
        const user: UserEntity = await context.db.users.findOne({
          key: 'id',
          equals: args.subscribingData.userId,
        });
        if (!user) {
          throw new Error('user with specified id not found');
        }

        const subscribeTo: UserEntity = await context.db.users.findOne({
          key: 'id',
          equals: args.subscribingData.subscribeToId,
        });
        if (!subscribeTo) {
          throw new Error('subscribeTo user with specified id not found');
        }

        if (
          user.subscribedToUserIds.includes(args.subscribingData.subscribeToId)
        ) {
          throw new Error('user has already subscribed to specified user');
        }

        return context.db.users.change(args.subscribingData.userId, {
          subscribedToUserIds: [
            ...user.subscribedToUserIds,
            args.subscribingData.subscribeToId,
          ],
        });
      },
    },
    unsubscribedToUsers: {
      type: userType,
      args: {
        unsubscribingData: { type: subscribingInputType },
      },
      resolve: async (_obj, args, context) => {
        const user = await context.db.users.findOne({
          key: 'id',
          equals: args.unsubscribingData.userId,
        });
        if (!user) {
          throw new Error('user with specified id not found');
        }

        const unsubscribeTo: UserEntity = await context.db.users.findOne({
          key: 'id',
          equals: args.unsubscribingData.subscribeToId,
        });
        if (!unsubscribeTo) {
          throw new Error('unsubscribeTo user with specified id not found');
        }

        return context.db.users.change(args.unsubscribingData.userId, {
          subscribedToUserIds: [
            ...user.subscribedToUserIds.filter(
              (id: string) => id !== args.unsubscribingData.subscribeToId
            ),
          ],
        });
      },
    },
  }),
});

export { mutationType };
