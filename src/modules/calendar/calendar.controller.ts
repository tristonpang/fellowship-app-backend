import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserType } from 'src/interfaces/users';
import { CalendarSyncService } from './calendar-sync.service';

@Controller('api/calendar')
export class CalendarController {
  constructor(private readonly calendarSyncService: CalendarSyncService) {}

  @Post('sync')
  async syncCalendar(
    @Body() body: { token: string; userType: UserType; userId: string },
  ) {
    return this.calendarSyncService.syncCalendar(
      body.token,
      body.userType,
      body.userId,
    );
  }

  @Get('google-oauth-callback')
  async googleOAuthCallback(@Param('code') code: string) {
    return this.calendarSyncService.googleOAuthCallback(code);
  }
}
