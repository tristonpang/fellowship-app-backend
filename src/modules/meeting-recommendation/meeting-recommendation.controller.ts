import { Controller, Get, Patch, Post, Query } from '@nestjs/common';
import { MeetingRecommendationService } from './meeting-recommendation.service';

@Controller('meeting-recommendation')
export class MeetingRecommendationController {
  constructor(
    private readonly meetingRecommendationService: MeetingRecommendationService,
  ) {}

  // For testing the recommendation logic
  @Get('recommend-meeting')
  async getRecommendedMeetingSlots(
    @Query('mentorId') mentorId: string,
    @Query('menteeId') menteeId: string,
  ) {
    return this.meetingRecommendationService.recommendMeetings(
      mentorId,
      menteeId,
    );
  }

  @Get('all')
  async getAllOpenMeetingRecommendations(@Query('mentorId') mentorId: string) {
    return this.meetingRecommendationService.getAllOpenMeetingRecommendations(
      mentorId,
    );
  }

  @Patch('decline')
  async declineMeetingRecommendation(
    @Query('mentorId') mentorId: string,
    @Query('meetingRecommendationId') meetingRecommendationId: string,
  ) {
    return this.meetingRecommendationService.declineMeetingRecommendation(
      mentorId,
      meetingRecommendationId,
    );
  }

  @Post('complete-meetings')
  async completeMeetings(@Query('mentorId') mentorId: string) {
    return this.meetingRecommendationService.completeMeetingsForMentor(
      mentorId,
    );
  }
}
