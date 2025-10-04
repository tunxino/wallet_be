import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import {
  algorithmName,
  DATA_NAME,
  IMAGE_TYPE,
  MESSAGES,
  SUPPORT_ICON_LINK,
} from '../common/const';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadImage(file: { buffer: Buffer; mimetype: string }) {
    if (!file || !file.buffer) {
      throw new BadRequestException(MESSAGES.NOT_FOUND);
    }

    try {
      const base64Str = `${DATA_NAME}:${file.mimetype};${algorithmName.BASE64},${file.buffer.toString(algorithmName.BASE64)}`;
      const result = await cloudinary.uploader.upload(base64Str, {
        folder: SUPPORT_ICON_LINK,
        resource_type: IMAGE_TYPE,
      });

      return result.secure_url;
    } catch (error) {
      throw new BadRequestException(`Upload failed: ${error.message}`);
    }
  }
}
