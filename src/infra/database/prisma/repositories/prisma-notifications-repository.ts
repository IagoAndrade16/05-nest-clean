import { NotificationsRepository } from "@/domain/notification/application/repositories/notifications-repository";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { PrismaNotificationMapper } from "../mappers/prisma-notification-mapper";
import { Notification } from "@/domain/notification/enterprise/entities/notification";


@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(
    private prisma: PrismaService,
  ) {}
  async create(notification: Notification): Promise<void> {
    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPrisma(notification),
    });
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id: id,
      },
    });

    return notification ? PrismaNotificationMapper.toDomain(notification) : null;
  }

  async delete(notification: Notification): Promise<void> {
    await this.prisma.notification.delete({
      where: {
        id: notification.id.toString(),
      },
    });
  }

  async save(notification: Notification): Promise<void> {
    await this.prisma.notification.update({
      where: {
        id: notification.id.toString(),
      },
      data: PrismaNotificationMapper.toPrisma(notification),
    });
  }
}