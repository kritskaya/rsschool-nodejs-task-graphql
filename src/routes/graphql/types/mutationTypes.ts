import {
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UserEntity } from '../../../utils/DB/entities/DBUsers';
import { memberTypeType, postType, profileType, userType } from './basicTypes';

const mutationType = new GraphQLObjectType({
  name: 'mutation',
  fields: () => ({
    createUser: {
      type: userType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_obj, args, context) =>
        context.users.create({
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
        }),
    },
    createProfile: {
      type: profileType,
      args: {
        avatar: { type: new GraphQLNonNull(GraphQLString) },
        sex: { type: new GraphQLNonNull(GraphQLString) },
        birthday: { type: new GraphQLNonNull(GraphQLInt) },
        country: { type: new GraphQLNonNull(GraphQLString) },
        street: { type: new GraphQLNonNull(GraphQLString) },
        city: { type: new GraphQLNonNull(GraphQLString) },
        memberTypeId: { type: new GraphQLNonNull(GraphQLID) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (_obj, args, context) =>
        context.profiles.create({
          avatar: args.avatar,
          sex: args.sex,
          birthday: args.birthday,
          country: args.country,
          street: args.street,
          city: args.city,
          memberTypeId: args.memberTypeId,
          userId: args.userId,
        }),
    },
    createPost: {
      type: postType,
      args: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (_obj, args, context) =>
        context.posts.create({
          title: args.title,
          content: args.content,
          userId: args.userId,
        }),
    },
    updateUser: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
      },
      resolve: (_obj, args, context) =>
        context.users.change(args.id, {
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
        }),
    },
    updateProfile: {
      type: profileType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        avatar: { type: GraphQLString },
        sex: { type: GraphQLString },
        birthday: { type: GraphQLInt },
        country: { type: GraphQLString },
        street: { type: GraphQLString },
        city: { type: GraphQLString },
        memberTypeId: { type: GraphQLID },
      },
      resolve: (_obj, args, context) =>
        context.profiles.change(args.id, {
          avatar: args.avatar,
          sex: args.sex,
          birthday: args.birthday,
          country: args.country,
          street: args.street,
          city: args.city,
          memberTypeId: args.memberTypeId,
        }),
    },
    updatePost: {
      type: postType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
      },
      resolve: (_obj, args, context) =>
        context.posts.change(args.id, {
          title: args.title,
          content: args.content,
        }),
    },
    updateMemberType: {
      type: memberTypeType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        discount: { type: GraphQLInt },
        monthPostsLimit: { type: GraphQLInt },
      },
      resolve: (_obj, args, context) =>
        context.memberTypes.change(args.id, {
          discount: args.discount,
          monthPostsLimit: args.monthPostsLimit,
        }),
    },
    subscribedToUsers: {
      type: userType,
      args: {
        userId: { type: GraphQLID },
        subscribeToId: { type: GraphQLID },
      },
      resolve: async (_obj, args, context) => {
        const subscribedToUsers = (
          await context.users.findOne({
            key: 'id',
            equals: args.userId,
          })
        ).subscribedToUserIds;
        return context.users.change(args.userId, {
          subscribedToUsers: [...subscribedToUsers, args.subscribeToId],
        });
      },
    },
    unsubscribedToUsers: {
      type: userType,
      args: {
        userId: { type: GraphQLID },
        unsubscribeToId: { type: GraphQLID },
      },
      resolve: async (_obj, args, context) => {
        const subscribedToUsers = (
          await context.users.findOne({
            key: 'id',
            equals: args.userId,
          })
        ).subscribedToUserIds;
        return context.users.change(args.userId, {
          subscribedToUsers: [
            ...subscribedToUsers.filter(
              (item: UserEntity) => item.id !== args.unsubscribeToId
            ),
          ],
        });
      },
    },
  }),
});

export { mutationType };
