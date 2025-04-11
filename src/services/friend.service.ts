import { FriendInput } from "../validations/friend";
import friendModel from "../models/friend.model";
import userModel from "../models/user.model";
import { BadRequestError } from "../middlewares/error.response";
import notificationPublish from "../messaging/notifcationPublish";
export class FriendService {
  async createFriend(data: FriendInput) {
    const { userId, friendId } = data;

    const user = await userModel.findById(userId).lean();
    const friendUser = await userModel.findById(friendId).lean();

    // check verify friendUser
    if (friendUser?.isVerified === false) {
      throw new BadRequestError("Friend user is not verified");
    }

    // check if user and friendUser exist
    if (!user || !friendUser) {
      throw new BadRequestError("User or friend not found");
    }

    // check if user and friend are already friends
    if (user._id.equals(friendUser._id)) {
      throw new BadRequestError("You cannot add yourself as a friend");
    }

    const friend = await friendModel.findOne({
      userId,
      friendId,
    });

    // notication
    await notificationPublish({
      senderId: userId,
      receiverId: friendId,
      content: `${user.profile.firstName} ${user.profile.lastName} sent you a friend request`,
      type: "friend",
    });

    // if friend already exists, update the status to pending
    if (friend) {
      // check if friend status unfriended
      if (
        friend.status === "unfriended" ||
        friend.status === "cancelled" ||
        friend.status === "rejected"
      ) {
        friend.status = "pending";
        await friend.save();
        return friend;
      }
      throw new BadRequestError("Friend request already exists");
    }

    // if friend does not exist, create a new friend
    const newFriend = await friendModel.create({
      userId,
      friendId,
      status: "pending",
    });

    return newFriend;
  }

  async acceptFriend(data: FriendInput) {
    const { friendId, userId } = data;
    const friend = await friendModel.findById(friendId);
    // check if friend exists
    if (!friend) {
      throw new BadRequestError("Friend request not found");
    }

    // check if friend user is  exist
    const friendUser = await userModel.findById(friend.friendId);
    const user = await userModel.findById(friend.userId);
    if (!friendUser || !user) {
      throw new BadRequestError("Friend user or user not found");
    }

    // check if friend user is not the same as the user
    if (!friend.friendId.equals(userId)) {
      throw new BadRequestError("You cannot accept this friend request");
    }

    // check if friend status pending
    if (friend.status !== "pending") {
      throw new BadRequestError("Friend request not found");
    }

    friend.status = "accepted";
    await friend.save();
    user.profile.friendsCount++;
    await user.save();
    friendUser.profile.friendsCount++;
    await friendUser.save();
    return friend;
  }

  async rejectFriend(data: FriendInput) {
    const { friendId, userId } = data;
    const friend = await friendModel.findById(friendId);
    // check if friend exists
    if (!friend) {
      throw new BadRequestError("Friend request not found");
    }

    if (!friend.friendId.equals(userId)) {
      throw new BadRequestError("You cannot reject this friend request");
    }

    // check if friend status pending
    if (friend.status !== "pending") {
      throw new BadRequestError("Friend request not found");
    }

    friend.status = "rejected";
    await friend.save();
    return friend;
  }
  async cancelFriend(data: FriendInput) {
    const { friendId, userId } = data;
    const friend = await friendModel.findById(friendId);

    // check if friend exists
    if (!friend) {
      throw new BadRequestError("Friend request not found");
    }

    if (!friend.userId.equals(userId)) {
      throw new BadRequestError("You cannot cancel this friend request");
    }

    // check if friend status pending
    if (friend.status !== "pending") {
      throw new BadRequestError("Friend request not found");
    }

    friend.status = "cancelled";
    await friend.save();
    return friend;
  }

  async unfriend(data: FriendInput) {
    const { friendId, userId } = data;
    const friend = await friendModel.findOne({
      $or: [
        { userId: userId, friendId: friendId },
        { userId: friendId, friendId: userId },
      ],
    });

    // check if friend exists
    if (!friend) {
      throw new BadRequestError("Friend request not found");
    }

    const friendUser = await userModel.findById(friend.friendId);
    const user = await userModel.findById(friend.userId);

    if (!friendUser || !user) {
      throw new BadRequestError("Friend user or user not found");
    }

    // check if friend status accepted
    if (friend.status !== "accepted") {
      throw new BadRequestError("Friend request not found");
    }

    friend.status = "unfriended";
    await friend.save();

    user.profile.friendsCount--;
    await user.save();

    friendUser.profile.friendsCount--;
    await friendUser.save();
    return friend;
  }

  async getFriends(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const friends = await friendModel
      .find({
        $or: [
          { userId, status: "accepted" },
          { friendId: userId, status: "accepted" },
        ],
      })
      .skip(skip)
      .limit(limit)
      .lean();
    return friends;
  }

  async getFriendRequests(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const friendRequests = await friendModel
      .find({
        $or: [
          { userId, status: "pending" },
          { friendId: userId, status: "pending" },
        ],
      })
      .skip(skip)
      .limit(limit)
      .lean();
    return friendRequests;
  }
  async findByNameFriend(
    userId: string,
    name: string,
    page: number,
    limit: number
  ) {
    const skip = (page - 1) * limit;
    const friends = await friendModel
      .find({
        $or: [
          { userId, status: "accepted" },
          { friendId: userId, status: "accepted" },
        ],
      })
      .populate({
        path: "friendId",
        match: { $text: { $search: name } },
      })
      .skip(skip)
      .limit(limit)
      .lean();

    // Lọc ra những bạn bè phù hợp (vì nếu không khớp text thì friendId sẽ là null)
    const matched = friends.filter((f) => f.friendId !== null);

    return matched;
  }
}

export default new FriendService();
