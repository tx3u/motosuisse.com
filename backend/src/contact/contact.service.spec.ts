import { NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ContactService } from './contact.service';

jest.mock('nodemailer', () => ({ createTransport: jest.fn() }));
import * as nodemailer from 'nodemailer';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockPrisma = {
  contact: {
    create: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

// Config returns undefined for MAIL_HOST by default → email code is skipped.
const mockConfig = {
  get: jest.fn().mockReturnValue(undefined),
  getOrThrow: jest.fn(),
};

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const makeContact = (overrides = {}) => ({
  id: 1,
  nom: 'Jean Dupont',
  email: 'jean@example.com',
  telephone: null,
  sujet: null,
  message: 'Bonjour',
  lu: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

const makeDto = (overrides = {}) => ({
  nom: 'Jean Dupont',
  email: 'jean@example.com',
  telephone: undefined,
  sujet: undefined,
  message: 'Bonjour',
  ...overrides,
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('ContactService', () => {
  let service: ContactService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new ContactService(mockConfig as never, mockPrisma as never);
  });

  // ── send ───────────────────────────────────────────────────────────────────

  describe('send', () => {
    it('persists the message to the database', async () => {
      mockPrisma.contact.create.mockResolvedValue(makeContact());

      await service.send(makeDto());

      expect(mockPrisma.contact.create).toHaveBeenCalledTimes(1);
      expect(mockPrisma.contact.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ nom: 'Jean Dupont', email: 'jean@example.com' }),
        }),
      );
    });

    it('returns a success message', async () => {
      mockPrisma.contact.create.mockResolvedValue(makeContact());

      const result = await service.send(makeDto());

      expect(result).toEqual({ message: 'Message envoyé avec succès.' });
    });

    it('skips the email transport when MAIL_HOST is not configured', async () => {
      mockConfig.get.mockReturnValue(undefined); // no MAIL_HOST
      mockPrisma.contact.create.mockResolvedValue(makeContact());

      // If nodemailer were called it would throw (no real SMTP server)
      await expect(service.send(makeDto())).resolves.not.toThrow();
    });

    it('still succeeds even when nom contains CRLF injection characters', async () => {
      mockPrisma.contact.create.mockResolvedValue(makeContact());

      await expect(
        service.send(makeDto({ nom: 'Evil\r\nBcc: hacker@bad.com\r\nName' })),
      ).resolves.not.toThrow();
    });

    it('sends an email notification when MAIL_HOST is configured', async () => {
      const mockSendMail = jest.fn().mockResolvedValue({});
      (nodemailer.createTransport as jest.Mock).mockReturnValue({ sendMail: mockSendMail });
      mockConfig.get.mockImplementation((key: string) => {
        if (key === 'MAIL_HOST') return 'smtp.example.com';
        if (key === 'MAIL_PORT') return 587;
        return undefined;
      });
      mockConfig.getOrThrow.mockReturnValue('admin@motosuisse.ch');
      mockPrisma.contact.create.mockResolvedValue(makeContact());

      const result = await service.send(makeDto());

      expect(mockSendMail).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ message: 'Message envoyé avec succès.' });
    });

    it('logs email error but still returns success when send fails', async () => {
      const mockSendMail = jest.fn().mockRejectedValue(new Error('SMTP timeout'));
      (nodemailer.createTransport as jest.Mock).mockReturnValue({ sendMail: mockSendMail });
      mockConfig.get.mockImplementation((key: string) => {
        if (key === 'MAIL_HOST') return 'smtp.example.com';
        return undefined;
      });
      mockConfig.getOrThrow.mockReturnValue('admin@motosuisse.ch');
      mockPrisma.contact.create.mockResolvedValue(makeContact());

      await expect(service.send(makeDto())).resolves.toEqual({ message: 'Message envoyé avec succès.' });
    });
  });

  // ── findAll ────────────────────────────────────────────────────────────────

  describe('findAll', () => {
    it('returns all messages ordered by createdAt desc', async () => {
      const messages = [makeContact({ id: 2 }), makeContact({ id: 1 })];
      mockPrisma.contact.findMany.mockResolvedValue(messages);

      const result = await service.findAll();

      expect(result).toEqual(messages);
      expect(mockPrisma.contact.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ orderBy: { createdAt: 'desc' } }),
      );
    });
  });

  // ── markAsRead ─────────────────────────────────────────────────────────────

  describe('markAsRead', () => {
    it('sets lu = true on the message', async () => {
      mockPrisma.contact.update.mockResolvedValue(makeContact({ lu: true }));

      const result = await service.markAsRead(1);

      expect(mockPrisma.contact.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { lu: true },
      });
      expect(result.lu).toBe(true);
    });

    it('throws NotFoundException when record does not exist (P2025)', async () => {
      const err = new Prisma.PrismaClientKnownRequestError('Not found', {
        code: 'P2025',
        clientVersion: '5.0.0',
      });
      mockPrisma.contact.update.mockRejectedValue(err);

      await expect(service.markAsRead(99)).rejects.toThrow(NotFoundException);
    });

    it('re-throws unexpected Prisma errors unchanged', async () => {
      const err = new Error('connection refused');
      mockPrisma.contact.update.mockRejectedValue(err);

      await expect(service.markAsRead(1)).rejects.toThrow('connection refused');
    });
  });

  // ── remove ─────────────────────────────────────────────────────────────────

  describe('remove', () => {
    it('deletes the message and returns a confirmation', async () => {
      mockPrisma.contact.delete.mockResolvedValue(makeContact());

      const result = await service.remove(1);

      expect(mockPrisma.contact.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({ message: 'Message supprimé.' });
    });

    it('throws NotFoundException when record does not exist (P2025)', async () => {
      const err = new Prisma.PrismaClientKnownRequestError('Not found', {
        code: 'P2025',
        clientVersion: '5.0.0',
      });
      mockPrisma.contact.delete.mockRejectedValue(err);

      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });

    it('re-throws unexpected errors from remove unchanged', async () => {
      mockPrisma.contact.delete.mockRejectedValue(new Error('DB down'));

      await expect(service.remove(1)).rejects.toThrow('DB down');
    });
  });
});
