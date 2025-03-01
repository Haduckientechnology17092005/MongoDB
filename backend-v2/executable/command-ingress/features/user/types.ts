type UserEntity = {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

interface UserService {
  getOne(id: string): Promise<UserEntity>;
  editUser(id: string, User: UserEntity): Promise<UserEntity>;
  deleteUser(id: string): Promise<void>;
  followUser(id: string, followerId: string): Promise<void>;
  unfollowUser(id: string, followerId: string): Promise<void>;
  suggestUsers(id: string): Promise<UserEntity[]>;
}

export {
  UserEntity,
  UserService,
};
