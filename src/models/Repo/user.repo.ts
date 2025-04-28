import userModel from "../user.model";

export class UserRepo {
  async findById(userId: string) {
    return await userModel.findById(userId);
  }
  async findbyEmail(email: string) {
    return await userModel.findOne({ email });
  }
  async findByUpdateVerify(email: string) {
    return await userModel.findOneAndUpdate(
      {
        email,
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
