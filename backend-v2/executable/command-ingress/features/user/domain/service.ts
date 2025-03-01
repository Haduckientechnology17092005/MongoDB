import { UserEntity, UserService } from '../types';
import UserModel from '../../../../../internal/model/user';

export class UserServiceImpl implements UserService {
  async getOne(id: string): Promise<UserEntity> {
    const user = await UserModel.findById(id);

    return {
      id: String(user._id),
      name: String(user.name),
      avatar: String(user.avatar),
      email: String(user.email),
    };
  }

  async editUser(id: string, User: UserEntity): Promise<UserEntity> {
    const user = await UserModel.findById(id);
    //change information
    if(User.name)
      user.name = User.name;
    if(User.avatar)
      user.avatar = User.avatar;
    if(User.email)
      user.email = User.email;
    await user.save();
    return {
      id: String(user._id),
      name: String(user.name),
      avatar: String(user.avatar),
      email: String(user.email),
    };
  }

  async deleteUser(id: string): Promise<void> {
    await UserModel.findByIdAndDelete(id);
  }

  async followUser(id: string, followerId: string): Promise<void> {
    const user = await UserModel.findById(id);
    const follower = await UserModel.findById(followerId);
    user.followers.push(follower._id);
    follower.followings.push(user._id);
    await user.save();
    await follower.save();
  }

  async unfollowUser(id: string, followerId: string): Promise<void> {
    const user = await UserModel.findById(id);
    const follower = await UserModel.findById(followerId);
    for(let i = 0; i < user.followers.length; i++) {
      if (user.followers[i].equals(follower._id)) {
        user.followers.splice(i, 1);
        break;
      }
    }
    for(let i = 0; i < follower.followings.length; i++) {
      if (follower.followings[i].equals(user._id)) {
        follower.followings.splice(i, 1);
        break;
      }
    }
    await user.save();
    await follower.save();
  }
  //use fillter unfollow
  // async unfollowUser(id: string, followerId: string): Promise<void> {
  //   const user = await UserModel.findById(id);
  //   const follower = await UserModel.findById(followerId);
  //   user.followers = user.followers.filter((followerId) => !followerId.equals(follower._id));
  //   follower.followings = follower.followings.filter((userId) => !userId.equals(user._id));  
  //   await user.save();
  //   await follower.save();
  // }
  //use pull in mongoose
  // async unfollowUser(id: string, followerId: string): Promise<void> {
  //   await UserModel.findByIdAndUpdate(id, { $pull: { followers: followerId } });
  //   await UserModel.findByIdAndUpdate(followerId, { $pull: { followings: id } });
  // }

  async suggestUsers(id: string): Promise<UserEntity[]> {
    const user = await UserModel.findById(id);
    const users = await UserModel.find({ _id: { $ne: user._id } });
    return users.map((user) => ({
      id: String(user._id),
      name: String(user.name),
      avatar: String(user.avatar),
      email: String(user.email),
    }));
  }

}