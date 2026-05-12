import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

/**
 * Maximum time in milliseconds to wait for a Cloudinary upload before aborting.
 * Prevents hung requests from tying up server resources indefinitely.
 */
const UPLOAD_TIMEOUT_MS = 30_000;

/**
 * Wraps the Cloudinary SDK to provide image upload and deletion with
 * proper error handling and a request timeout.
 *
 * Credentials are read automatically from the `CLOUDINARY_URL` environment
 * variable (format: `cloudinary://api_key:api_secret@cloud_name`).
 */
@Injectable()
export class UploadService {
  /**
   * Uploads a raw image buffer to Cloudinary and returns the CDN URL.
   *
   * Races the SDK promise against a {@link UPLOAD_TIMEOUT_MS}-ms timer so the
   * promise always settles — even if the Cloudinary SDK hangs.
   *
   * @param buffer - Raw image bytes. MIME type and size must be validated by
   *   the caller before this method is invoked.
   * @param folder - Cloudinary folder path (e.g. `"motosuisse/motos"`).
   * @returns HTTPS CDN URL of the uploaded image.
   * @throws {InternalServerErrorException} If the upload fails or times out.
   */
  async uploadImage(buffer: Buffer, folder: string): Promise<string> {
    const upload = new Promise<string>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder, resource_type: 'image' }, (err, result) => {
          if (err || !result) {
            return reject(err ?? new Error('Cloudinary upload returned no result'));
          }
          resolve(result.secure_url);
        })
        .end(buffer);
    });

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Upload timeout after ${UPLOAD_TIMEOUT_MS / 1000}s`)),
        UPLOAD_TIMEOUT_MS,
      ),
    );

    try {
      return await Promise.race([upload, timeout]);
    } catch (err) {
      throw new InternalServerErrorException(
        `Échec de l'upload Cloudinary : ${String(err)}`,
      );
    }
  }

  /**
   * Deletes a Cloudinary asset by its public ID.
   *
   * @param publicId - Cloudinary public ID (not the full URL — omit extension).
   */
  async deleteImage(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}
