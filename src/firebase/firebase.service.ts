import { Injectable } from '@nestjs/common';
import admin from '../config/firebase-config';

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
}
