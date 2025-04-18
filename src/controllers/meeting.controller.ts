import { Controller, Get, Post, Put, Query } from '@nestjs/common';
import { MeetingRecommendationService } from '../services/meeting-recommendation-legacy.service';

@Controller('api/meetings')
export class MeetingController {
  constructor(
    private readonly meetingRecommendationService: MeetingRecommendationService,
  ) {}

  // For testing the recommendation logic
  // @Get('recommendations')
  // async getRecommendations() {
  //   const mentorId = mockMentorId;
  //   const menteeId = mockMenteeId;
  //   return this.meetingRecommendationService.recommendMeeting(
  //     mentorId,
  //     menteeId,
  //   );
  // }

  @Put('reject')
  async rejectAppointment(
    @Query('mentorId') mentorId: string,
    @Query('menteeId') menteeId: string,
  ) {
    return this.meetingRecommendationService.rejectMeeting(mentorId, menteeId);
  }

  @Get()
  async getAppointments(@Query('mentorId') mentorId: string) {
    return this.meetingRecommendationService.getAppointments(mentorId);
  }

  @Post('check')
  async checkAppointments() {
    return this.meetingRecommendationService.checkAppointments();
  }
}
