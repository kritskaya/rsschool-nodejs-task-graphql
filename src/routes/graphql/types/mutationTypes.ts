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
        context.users.create({
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
      resolve: (_obj, args, context) =>
        context.profiles.create({
          avatar: args.profileData.avatar,
          sex: args.profileData.sex,
          birthday: args.profileData.birthday,
          country: args.profileData.country,
          street: args.profileData.street,
          city: args.profileData.city,
          memberTypeId: args.profileData.memberTypeId,
          userId: args.profileData.userId,
        }),
    },
    createPost: {
      type: postType,
      args: {
        postData: { type: createPostInputType },
      },
      resolve: (_obj, args, context) =>
        context.posts.create({
          title: args.postData.title,
          content: args.postData.content,
          userId: args.postData.userId,
        }),
    },
    updateUser: {
      type: userType,
      args: {
        userData: { type: updateUserInputType },
      },
      resolve: (_obj, args, context) =>
        context.users.change(args.userData.id, {
          firstName: args.userData.firstName,
          lastName: args.userData.lastName,
          email: args.userData.email,
        }),
    },
    updateProfile: {
      type: profileType,
      args: {
        profileData: { type: updateProfileInputType },
      },
      resolve: (_obj, args, context) =>
        context.profiles.change(args.profileData.id, {
          avatar: args.profileData.avatar,
          sex: args.profileData.sex,
          birthday: args.profileData.birthday,
          country: args.profileData.country,
          street: args.profileData.street,
          city: args.profileData.city,
          memberTypeId: args.profileData.memberTypeId,
        }),
    },
    updatePost: {
      type: postType,
      args: {
        postData: { type: updatePostInputType },
      },
      resolve: (_obj, args, context) =>
        context.posts.change(args.postData.id, {
          title: args.postData.title,
          content: args.postData.content,
        }),
    },
    updateMemberType: {
      type: memberTypeType,
      args: {
        memberTypeData: { type: updateMemberTypeInputType },
      },
      resolve: (_obj, args, context) =>
        context.memberTypes.change(args.memberTypeData.id, {
          discount: args.memberTypeData.discount,
          monthPostsLimit: args.memberTypeData.monthPostsLimit,
        }),
    },
    subscribedToUsers: {
      type: userType,
      args: {
        // userId: { type: GraphQLID },
        // subscribeToId: { type: GraphQLID },
        subscribingData: { type: subscribingInputType },
      },
      resolve: async (_obj, args, context) => {
        const user: UserEntity = await context.users.findOne({
          key: 'id',
          equals: args.subscribingData.userId,
        });

        return context.users.change(args.subscribingData.userId, {
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
        const user = await context.users.findOne({
          key: 'id',
          equals: args.unsubscribingData.userId,
        });

        return context.users.change(args.unsubscribingData.userId, {
          subscribedToUserIds: [
            ...user.subscribedToUserIds.filter(
              (item: UserEntity) =>
                item.id !== args.unsubscribingData.unsubscribeToId
            ),
          ],
        });
      },
    },
  }),
});

export { mutationType };
