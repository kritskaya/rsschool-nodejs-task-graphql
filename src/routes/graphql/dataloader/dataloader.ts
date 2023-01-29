import DataLoader = require('dataloader');
import DB from '../../../utils/DB/DB';

export const createLoaders = (db: DB) => {
  return {
    users: new DataLoader((ids: any) => getUsersByIds(db, ids)),
    profiles: new DataLoader((ids: any) => getProfilesByIds(db, ids)),
    posts: new DataLoader((ids: any) => getPostsByIds(db, ids)),
    // memberTypes: new DataLoader(ids => getMemberTypes(ids))
  };
}

const getUsersByIds = async (db: DB, ids: string[]) => {
  const allUsers = await db.users.findMany();

  return ids.map((id) => allUsers.find((user) => user.id === id));
}

const getProfilesByIds = async (db: DB, ids: string[]) => {
  const allProfiles = await db.profiles.findMany();

  return ids.map((id) => allProfiles.find((profile) => profile.id === id));
}

const getPostsByIds = async (db: DB, ids: string[]) => {
  const allPosts = await db.posts.findMany();

  return ids.map((id) => allPosts.find((post) => post.id === id));
}