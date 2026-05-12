import { InternalServerErrorException } from '@nestjs/common';
import { UploadService } from './upload.service';

// ─── Mock cloudinary ──────────────────────────────────────────────────────────
// Jest hoists jest.mock calls before imports, so the module is mocked before
// the service loads it.

const mockUploadStream = jest.fn();
const mockDestroy = jest.fn();

jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      upload_stream: (...args: unknown[]) => mockUploadStream(...args),
      destroy: (...args: unknown[]) => mockDestroy(...args),
    },
  },
}));

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new UploadService();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ── uploadImage ────────────────────────────────────────────────────────────

  describe('uploadImage', () => {
    it('returns the CDN URL on success', async () => {
      // Simulate cloudinary calling back with a result
      mockUploadStream.mockImplementation((_opts, cb) => {
        const fakeStream = {
          end: (buffer: Buffer) => {
            expect(buffer).toBeInstanceOf(Buffer);
            cb(null, { secure_url: 'https://res.cloudinary.com/test/image.jpg' });
          },
        };
        return fakeStream;
      });

      const result = await service.uploadImage(Buffer.from('fake'), 'motosuisse/motos');

      expect(result).toBe('https://res.cloudinary.com/test/image.jpg');
    });

    it('throws InternalServerErrorException when Cloudinary returns an error', async () => {
      mockUploadStream.mockImplementation((_opts, cb) => ({
        end: () => cb(new Error('Cloudinary unavailable'), null),
      }));

      await expect(
        service.uploadImage(Buffer.from('fake'), 'motosuisse/motos'),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('throws InternalServerErrorException when Cloudinary returns no result', async () => {
      mockUploadStream.mockImplementation((_opts, cb) => ({
        end: () => cb(null, null), // null result
      }));

      await expect(
        service.uploadImage(Buffer.from('fake'), 'motosuisse/motos'),
      ).rejects.toThrow(InternalServerErrorException);
    });

    it('throws InternalServerErrorException when the upload times out', async () => {
      // Never call the callback → upload hangs until the 30s timer fires.
      jest.useFakeTimers();

      mockUploadStream.mockImplementation(() => ({ end: () => { /* hang forever */ } }));

      const uploadPromise = service.uploadImage(Buffer.from('fake'), 'motosuisse/motos');

      // Advance past the 30-second timeout
      jest.advanceTimersByTime(31_000);

      await expect(uploadPromise).rejects.toThrow(InternalServerErrorException);
    });

    it('passes the correct folder to the upload_stream call', async () => {
      mockUploadStream.mockImplementation((_opts, cb) => ({
        end: () => cb(null, { secure_url: 'https://cdn.test/img.jpg' }),
      }));

      await service.uploadImage(Buffer.from('data'), 'motosuisse/motos');

      expect(mockUploadStream).toHaveBeenCalledWith(
        expect.objectContaining({ folder: 'motosuisse/motos', resource_type: 'image' }),
        expect.any(Function),
      );
    });
  });

  // ── deleteImage ────────────────────────────────────────────────────────────

  describe('deleteImage', () => {
    it('calls cloudinary destroy with the public ID', async () => {
      mockDestroy.mockResolvedValue({ result: 'ok' });

      await service.deleteImage('motosuisse/motos/abc123');

      expect(mockDestroy).toHaveBeenCalledWith('motosuisse/motos/abc123');
    });
  });
});
