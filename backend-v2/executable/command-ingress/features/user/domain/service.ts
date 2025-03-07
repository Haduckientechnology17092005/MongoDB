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
    const currentUser = await UserModel.findById(id);
    if (!currentUser) throw new Error("User not found");
    const followingList = currentUser.followings?.map(user => user.toString()) || [];
    const friendFollowing = await UserModel.find(
        { _id: { $in: followingList } },
        { followings: 1, _id: 0 }
    );
    const suggestedByFriends = friendFollowing
        .flatMap(user => user.followings?.map(following => following.toString()) || [])
        .filter(userId => userId !== id && !followingList.includes(userId));
    const popularUsers = await UserModel.find(
        { $expr: { $gte: [{ $size: "$followers" }, 100000] }, _id: { $ne: id } },
        { _id: 1 }
    );
    const popularUserIds = popularUsers.map(user => user._id.toString());
    const finalSuggestedIds = Array.from(new Set([...suggestedByFriends, ...popularUserIds]));
    const suggestedUsers = await UserModel.find(
        { _id: { $in: finalSuggestedIds } },
        { password: 0 }
    );
    return suggestedUsers.map(user => ({
        id: user._id.toString(), 
        email: user.email,
        name: user.name,
        avatar: user.avatar
    }));
  }
  async getAllFollowers(id: string): Promise<UserEntity[]> {
    const user = await UserModel.findById(id);
    const followers = await UserModel.find({ _id: { $in: user.followers } });
    return followers.map((user) => ({
      id: String(user._id),
      name: String(user.name),
      avatar: String(user.avatar),
      email: String(user.email),
    }));
  }

  async getAllFollowings(id: string): Promise<UserEntity[]> {
    const user = await UserModel.findById(id);
    const followings = await UserModel.find({ _id: { $in: user.followings } });
    return followings.map((user) => ({
      id: String(user._id),
      name: String(user.name),
      avatar: String(user.avatar),
      email: String(user.email),
    }));
  }

  async getAllList(id: string): Promise<UserEntity[]> {
    const user = await UserModel.findById(id);
    const lists = await UserModel.find({ _id: { $in: user.lists } });
    return lists.map((list) => ({
      id: String(list._id),
      name: String(list.name),
      avatar: String(list.avatar),
      email: String(list.email),
    }));
  }
}