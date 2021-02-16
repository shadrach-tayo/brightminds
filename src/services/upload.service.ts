// import bcrypt from 'bcrypt';
// import { CreateUserDto } from '../dtos/users.dto';
import HttpException from '../exceptions/HttpException';
import { User } from '../interfaces/domain.interface';
import DB from '../database';
// import { isEmpty } from '../utils/util';
import aws from 'aws-sdk';
import fs from 'fs';
// import path from 'path';

class UploadService {
  public users = DB.Users;
  public s3 = new aws.S3();
  private USER_AVATAR_KEY = 'userAvatar';

  public async uploadUserAvatar({ userId, avatarFile }): Promise<User> {
    const findUser: User = await this.users.findByPk(userId);
    if (!findUser) throw new HttpException(409, "You're not user");

    const arr = avatarFile.originalname.split('.');
    const fileExt = arr[arr.length - 1];
    const params = {
      ACL: 'public-read',
      Bucket: process.env.BUCKET_NAME,
      Body: fs.createReadStream(avatarFile.path),
      Key: `${this.USER_AVATAR_KEY}/${userId}.${fileExt}`,
    };

    let result;
    await this.s3.upload(params, async (err, data) => {
      if (err) {
        console.log('Error occured while trying to upload to S3 bucket', err);
        throw new HttpException(409, 'We could not upload you image avatar now, try again later');
      }
      console.log('file path ', avatarFile.path);
      if (data) {
        fs.unlinkSync(process.cwd() + '/' + avatarFile.path); // Empty temp folder
        const locationUrl = data.Location;

        await this.users.update({ avatar_url: locationUrl }, { where: { id: userId } });
        const updatedUser: User = await this.users.findByPk(userId, { attributes: ['avatar_url'] });
        result = updatedUser;
        // return updatedUser;
      } else {
        throw new HttpException(409, 'We could not upload you image avatar now, try again later');
      }
    });
    // const allUser: User[] = await this.users.findAll();
    return result;
  }
}

export default UploadService;
