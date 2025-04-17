import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';

const serviceAccount = {
  type: 'service_account',
  project_id: 'mywallet-acb03',
  private_key_id: '566895b06bc4faf852fbf0fb7ca968d79d896d68',
  private_key:
    '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDgjnmbwzVQaphz\nMfZYfKRtI+AtvT62cqp1ORm+r29FgVGqM1tN97piUPvW1DZFCvv3YbwBTpJPQAW7\nQOCurqWfODjwMPVPkFuKzSHAfq14k9RiidfN8s7uNSFaNWEqBkQ6u4wTvGul7GY8\nGiui1mHp9HyXUPYM2vTwP5aAaZolx6RodXETGehzm8y7PMNZ3LeTtFVqznxJxvCk\nBD4K7hb0N5wmv3VkM4Cxf6/XNskrt4j96O8xJNJopgczxBKBbmEn4IhG+QnxM5jI\nH2AbYIDxW9m/lrYIgUBGKrNxe1wbTtcHdhEkiGR7s6j32LGUDrQeTWPmwOEtUIpl\nOv3166RBAgMBAAECggEANxFJajS/VManNwyoDEAYtHkJRz4y7FwHSDLmCNiN0X4q\nkDIC8IZRKz4P3DlzS5ArhRlvGOTzRUL+hNKepsfGbtrDP8fJyKauhEXUwpduI/Ug\nrr998A/cxha6ZJxVhRA/WCXY7pgUz/4+ffuu+sJXBaACk7rzc+iYC3iUiE4dUqkC\nm03RLf0P430ac8iIMocEPT5Hu5AHld1hyGrLOos83xPLhtbjndVSrcNcdlDqC81U\nqM7a9pKlYaUs5sQefjhqlFNRlWpu5qISl/vFxBNOQE3Jc77sY/kywkqe7GoyyvYm\nP7DJiPlnXnU/qGJisZPPdDPlhEi6Fy6imDvA35ea3wKBgQD1yGnrRGc/va2NqS30\nS7SlDG/g1yBsL2eHd1C1iDsNDD4R0p4DS/+11u2vj/oLGsvaKsArRL0lujb5M0Vl\nsTAXWUz7qXCsouO9AP/IYYOvjn75MxK6/zdUsFp+FCXB+6AiWfMuvBpAn3TdBn8Y\nx4kCj6QgPI5oINGtYWAjlJWu/wKBgQDp5Cx81amzdjk1VPWJvXc36spUWvolANjn\n0ePPqMD8WIBSBKOj/O7iVubuEZ1ontcksBuOVw388Sqr6ceuP+XWua/1s7aZzXC1\nRN4dAT8V5vnOyakJbfs6asaLUOBIcjn75/IQX9RjwMYwlDSd663PT+VkYTckWUjo\ndDwxPhXsvwKBgQCDRX5k3Mz0e19FqRVVRFYATSs4AE5d2dfGv5BI1LENX/uK0133\nztCNk3SxbwmSgsZcCLdIpNcNXm7cHGk1TjSsU9LNGwuF+R3/pZf3szV9P3NLr96S\nJ5uqzOIYMrST7cvybO54iJjQ6Rmmr0CUwIXJ62Qyn4VD0juLCdYqSsLDiwKBgQC1\nr66zRlJt+u9Ts2yNE+WxRSzovEdGSVM1OUErBZ7sJ19+1uW7NHbo0bLPylUpeQIN\nGNQ/DPbrvvdz1cVsYWyMEXBTf8ffz8u2tAmKJHa579Orw9EQZyPZ7CnQ/QFMpZbP\nTQ0nlRlqZ8xM3kPFTNeWjCzYfgAUt1rAX9KGOgFUBwKBgCrO3Z433YP2ivr3o5+q\nnE6ypwtvNiBbOVwfY/NXjclZ5UE/ZBk8qiNGi2t6OOvLiRCMgXvus39qaTyim/Ui\nzfF6VNiPud1nxqNU9mWQBy5jJpY+JXINzK9PBtgHJsTEZr6dGYjEKTftvK8TGisT\nt902Zh2rlKYp/jvRtDKB3bcD\n-----END PRIVATE KEY-----\n',
  client_email:
    'firebase-adminsdk-r53bw@mywallet-acb03.iam.gserviceaccount.com',
  client_id: '106948426942442894510',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url:
    'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-r53bw%40mywallet-acb03.iam.gserviceaccount.com',
  universe_domain: 'googleapis.com',
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

export const storage = admin.storage();
export default admin;
