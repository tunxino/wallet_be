import { Injectable } from '@nestjs/common';
import { StorageClient } from '@supabase/storage-js';

@Injectable()
export class SupabaseService {
  private supabaseStorage: StorageClient;
  private readonly bucketName: string = 'images';

  constructor() {
    this.supabaseStorage = new StorageClient(process.env.SUPABASE_URL, {
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
      apikey: process.env.SUPABASE_SERVICE_KEY,
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const { data, error } = await this.supabaseStorage
      .from(this.bucketName)
      .upload(`${Date.now()}_${file.filename}`, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }

    const { data: urlData } = this.supabaseStorage
      .from(this.bucketName)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  }
}
