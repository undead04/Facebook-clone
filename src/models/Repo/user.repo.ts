import userModel from "../user.model";

export class UserRepo {
  async findById(userId: string) {
    return await userModel.findById(userId).where({ isDelete: false });
  }
  async findbyEmail(email: string) {
    return await userModel.findOne({ email }).where({ isDelete: false });
  }
  async findByUpdateVerify(email: string) {
    return await userModel.findOneAndUpdate(
      {
        email,
        isDelete: false,
      },
      {
        $set: {
          isVerified: true,
        },
      },
      {
        new: true,
      }
    );
  }

  async findByUpdatePassword(email: string, password: string) {
    return await userModel.findOneAndUpdate(
      {
        email,
        isDelete: false,
      },
      {
        $set: {
          password: password,
        },
      },
      {
        new: true,
      }
    );
  }
}
