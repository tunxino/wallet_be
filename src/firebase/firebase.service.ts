import { Injectable } from '@nestjs/common';
import admin, { storage } from "../config/firebase-config";

@Injectable()
export class FirebaseService {
  async sendNotification(token: string, title: string, body: string) {
    try {
      const message = {
        token, // Device token to which the notification will be sent
        notification: {
          title,
          body,
        },
        data: {
          title,
          body,
        },
      };

      const response = await admin.messaging().send(message);
      console.log('Successfully sent message:', response);
      return response;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const bucket = storage.bucket('cigarhclub.appspot.com');

    const fileName = `${Date.now()}-${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    return new Promise((resolve, reject) => {
      stream.on('error', (error) => {
        reject(error);
      });

      stream.on('finish', async () => {
        // Make the file publicly accessible
        await fileUpload.makePublic();

        // Get the public URL
        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
        resolve(publicUrl);
      });

      stream.end(file.buffer);
    });
  }

}
