import { Controller, Post, Body, Req } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { retrieveUserInfoFromRequest } from 'src/utils/helpers';
import { Request } from 'express';

@Controller('push')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  // TODO: for testing - to be removed in production
  @Post('test-notification')
  async notify(@Body() body: { userId: string; message: string }) {
    const { userId, message } = body;
    await this.notificationService.sendNotification(userId, message);
    return { result: 'Notification sent successfully' };
  }

  @Post('register-client')
  async registerClient(
    @Body() body: { registrationToken: string },
    @Req() req: Request,
  ) {
    const { userId } = retrieveUserInfoFromRequest(req);
    await this.notificationService.registerClient(
      userId,
      body.registrationToken,
    );
  }
}
