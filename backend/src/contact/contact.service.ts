import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service';
import { ContactDto } from './dto/contact.dto';

/**
 * Manages inbound contact messages.
 *
 * Every submission is persisted to the database first, making the record
 * durable regardless of email delivery outcome.  The email send is a
 * best-effort notification — failure is logged but does not surface as an
 * error to the sender.
 */
@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Persists a contact form submission and optionally sends a notification email.
   *
   * The database write always happens first; if the email transport is not
   * configured or the send fails, the message is still retained and the
   * caller receives a success response (the admin can read it in the dashboard).
   *
   * @param dto - Validated contact form data.
   * @returns Confirmation message.
   */
  async send(dto: ContactDto) {
    // Always persist first — email is a notification, not the source of truth
    await this.prisma.contact.create({
      data: {
        nom: dto.nom,
        email: dto.email,
        telephone: dto.telephone,
        sujet: dto.sujet,
        message: dto.message,
      },
    });

    const host = this.config.get('MAIL_HOST');
    if (!host) {
      this.logger.log(`[Contact] Saved (no MAIL_HOST). From: ${dto.email}`);
      return { message: 'Message envoyé avec succès.' };
    }

    const transporter = nodemailer.createTransport({
      host,
      port: this.config.get<number>('MAIL_PORT') ?? 587,
      // port 587 uses STARTTLS — do NOT set secure:true (that is for port 465)
      secure: false,
      requireTLS: true,
      auth: {
        user: this.config.get('MAIL_USER'),
        pass: this.config.get('MAIL_PASS'),
      },
    });

    // Sanitise nom to prevent email header injection (CRLF injection attack)
    const safeName = dto.nom.replaceAll(/[\r\n\t]/g, ' ').trim();

    try {
      await transporter.sendMail({
        from: `"${safeName}" <${dto.email}>`,
        to: this.config.getOrThrow('MAIL_TO'),
        subject: dto.sujet ?? 'Nouveau message de contact — MotoSuisse',
        text: `Nom: ${dto.nom}\nEmail: ${dto.email}\nTéléphone: ${dto.telephone ?? '-'}\n\n${dto.message}`,
      });
    } catch (err) {
      // Message is already in DB — log and continue, do not surface to the user
      this.logger.error(`[Contact] Email notification failed: ${String(err)}`);
    }

    return { message: 'Message envoyé avec succès.' };
  }

  /**
   * Returns all contact messages ordered by most recent first.
   * Requires admin authentication (enforced at the controller level).
   */
  findAll() {
    return this.prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Marks a message as read.
   *
   * @param id - Message primary key.
   * @throws {NotFoundException} If no message with the given ID exists.
   */
  async markAsRead(id: number) {
    try {
      return await this.prisma.contact.update({
        where: { id },
        data: { lu: true },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException('Message introuvable');
      }
      throw e;
    }
  }

  /**
   * Permanently deletes a contact message.
   *
   * @param id - Message primary key.
   * @throws {NotFoundException} If no message with the given ID exists.
   */
  async remove(id: number) {
    try {
      await this.prisma.contact.delete({ where: { id } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException('Message introuvable');
      }
      throw e;
    }
    return { message: 'Message supprimé.' };
  }
}
