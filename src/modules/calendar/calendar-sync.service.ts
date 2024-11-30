import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Auth, google } from 'googleapis';
import { DateTime } from 'luxon';
import { UserPayload } from '../auth/interfaces/user-payload';

// TODO: move to redis
const userStateMap: { [state: string]: string } = {};
const userGoogleTokenMap: { [userId: string]: any } = {};

@Injectable()
export class CalendarSyncService {
  private googleOauth2Client: Auth.OAuth2Client;

  constructor(private configService: ConfigService) {
    // Setup your API client
    this.googleOauth2Client = new google.auth.OAuth2(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      'http://localhost:3000/api/calendar/google-oauth-callback',
    );
  }

  async initiateGoogleOAuth(userPayload: UserPayload) {
    const userState = crypto.randomBytes(32).toString('hex');
    userStateMap[userState] = userPayload.userId;

    const scopes = ['https://www.googleapis.com/auth/calendar'];
    const url = this.googleOauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      state: userState,
    });
    return url;
  }

  async googleOAuthCallback(code: string, state: string) {
    const userId = userStateMap[state];

    const { tokens } = await this.googleOauth2Client.getToken(code);
    this.googleOauth2Client.setCredentials(tokens);

    // Retrieve user's calendar events
    const googleCalendar = google.calendar({
      version: 'v3',
      auth: this.googleOauth2Client,
    });

    const now = DateTime.now();
    const limit = now.plus({ months: 1 }); // TODO: check how often mentor wants to meet mentee, then limit to that

    const calendars = (await googleCalendar.calendarList.list()).data.items;

    // TODO: allow users to omit calendars

    const userCalendarEvents = [];
    for (const calendar of calendars) {
      const eventsResponse = await googleCalendar.events.list({
        calendarId: calendar.id,
        timeMin: now.toISO(),
        timeMax: limit.toISO(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = eventsResponse.data.items;
      userCalendarEvents.push(...events);
    }

    userCalendarEvents.sort((a, b) => {
      const aComparison = a.start?.dateTime
        ? DateTime.fromISO(a.start.dateTime).toMillis()
        : DateTime.fromSQL(a.start.date).toMillis();
      const bComparison = b.start?.dateTime
        ? DateTime.fromISO(b.start.dateTime).toMillis()
        : DateTime.fromSQL(b.start.date).toMillis();

      return aComparison - bComparison;
    });

    return userCalendarEvents;
  }

  // async syncCalendar(token: string, userType: UserType, userId: string) {
  // const calendar = google.calendar({ version: 'v3', auth: token });

  // // Get events for the next month
  // const response = await calendar.events.list({
  //   calendarId: 'primary',
  //   timeMin: new Date().toISOString(),
  //   timeMax: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  //   singleEvents: true,
  //   orderBy: 'startTime',
  // });

  // const events = response.data.items;
  // const availability = this.processEvents(userId, userType, events);

  // return availability;
  // }

  // private processEvents(userId: string, userType: UserType, events: any[]) {
  //   events.forEach((event) => {
  //     if (event.start?.dateTime && event.end?.dateTime) {
  //       // not full day
  //       const start = new Date(event.start.dateTime);
  //       const end = new Date(event.end.dateTime);

  //       const currentEvent: CalendarEvent = new CalendarEvent(
  //         false,
  //         start,
  //         end,
  //       );

  //       if (userType === UserType.MENTOR) {
  //         mentorAvailabilityDb[userId].push(currentEvent);
  //       } else if (userType === UserType.MENTEE) {
  //         menteeAvailabilityDb[userId].push(currentEvent);
  //       }
  //     } else if (event.start?.date) {
  //       // full day
  //       const start = new Date(event.start.date);
  //       const end = new Date(event.end.date);

  //       const currentEvent: CalendarEvent = new CalendarEvent(true, start, end);

  //       if (userType === UserType.MENTOR) {
  //         mentorAvailabilityDb[userId].push(currentEvent);
  //       } else if (userType === UserType.MENTEE) {
  //         menteeAvailabilityDb[userId].push(currentEvent);
  //       }
  //     }
  //   });
  // }
}
