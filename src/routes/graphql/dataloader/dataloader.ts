import DataLoader = require('dataloader');
import DB from '../../../utils/DB/DB';

export const createLoaders = (db: DB) => {
  return {
    users: new DataLoader((ids: any) => getUsersByIds(db, ids)),
    profiles: new DataLoader((userIds: any) => getProfilesByIds(db, userIds)),
    posts: new DataLoader((userIds: any) => getPostsByIds(db, userIds)),
    memberTypes: new DataLoader((ids: any) => getMemberTypes(db, ids)),
    subscribedToUser: new DataLoader((userIds: any) =>
      getSubscribedToUser(db, userIds)
    ),
  };
};

const getUsersByIds = async (db: DB, ids: string[]) => {
  const allUsers = await db.users.findMany();

  return ids.map((id) => allUsers.find((user) => user.id === id));
};

const getProfilesByIds = async (db: DB, userIds: string[]) => {
  const allProfiles = await db.profiles.findMany();

  const profiles = userIds.map((id) =>
    allProfiles.find((profile) => profile.userId === id)
  );
  return profiles;
};

const getPostsByIds = async (db: DB, userIds: string[]) => {
  const allPosts = await db.posts.findMany();

  const posts = userIds.map((id) =>
    allPosts.filter((post) => post.userId === id)
  );
  return posts;
};

const getMemberTypes = async (db: DB, userIds: string[]) => {
  const allMemberTypes = await db.memberTypes.findMany();

  const memberTypes = userIds.map((id) =>
    allMemberTypes.find((memberType) => memberType.id === id)
  );
  return memberTypes;
};

const getSubscribedToUser = async (db: DB, userIds: string[]) => {
  const allUsers = await db.users.findMany();

  const subscribedToUser = userIds.map((id) =>
    allUsers.filter((user) => user.subscribedToUserIds.includes(id))
  );
  return subscribedToUser;
};
