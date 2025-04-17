import { Injectable } from '@nestjs/common';
import admin from '../config/firebase-config';
import { ServiceAccount } from 'firebase-admin';
import * as serviceAccount from '../config/firebase-config';

@Injectable()
export class FirebaseService {
  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as ServiceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      });
    }
  }

  async sendNotification(
    token: string,
    title: string,
    body: string,
    data: Record<string, string> = {},
  ) {
    try {
      const message = {
        notification: { title, body },
        token,
        data,
      };

      const response = await admin.messaging().send(message);
      console.log('✅ Notification sent:', response);
    } catch (error) {
      console.error('❌ Error sending notification:', error);
    }
  }

  // async uploadFile(file: Express.Multer.File): Promise<string> {
  //   const bucket = storage.bucket('cigarhclub.appspot.com');
  //
  //   const fileName = `${Date.now()}-${file.originalname}`;
  //   const fileUpload = bucket.file(fileName);
  //
  //   const stream = fileUpload.createWriteStream({
  //     metadata: {
  //       contentType: file.mimetype,
  //     },
  //   });
  //
  //   return new Promise((resolve, reject) => {
  //     stream.on('error', (error) => {
  //       reject(error);
  //     });
  //
  //     stream.on('finish', async () => {
  //       // Make the file publicly accessible
  //       await fileUpload.makePublic();
  //
  //       // Get the public URL
  //       const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
  //       resolve(publicUrl);
  //     });
  //
  //     stream.end(file.buffer);
  //   });
  // }
}
