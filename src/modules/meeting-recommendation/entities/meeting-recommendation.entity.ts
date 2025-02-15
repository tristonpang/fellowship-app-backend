import { AppointmentStatus } from 'src/interfaces/appointments';
import { UserRelationEntity } from 'src/modules/users/entities/user-relation.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MeetingRecommendation } from '../domain/meeting-recommendation.domain';

@Entity({
  name: 'meeting_recommendation',
})
export class MeetingRecommendationEntity {
  constructor(props?: Partial<MeetingRecommendationEntity>) {
    if (props) Object.assign(this, props);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserRelationEntity, (userRelation) => userRelation.id)
  @JoinColumn({ name: 'fk_user_relation_id' })
  userRelation: UserRelationEntity;

  @Column()
  startDateTime: Date;

  @Column()
  endDateTime: Date;

  @Column()
  status: AppointmentStatus;

  static from(
    meetingRecommendation: MeetingRecommendation,
  ): MeetingRecommendationEntity {
    const userRelation = new UserRelationEntity({
      fromUser: new UserEntity({ id: meetingRecommendation.fromUserId }),
      toUser: new UserEntity({ id: meetingRecommendation.toUserId }),
    });

    return new MeetingRecommendationEntity({
      userRelation,
      startDateTime: meetingRecommendation.startDateTime,
      endDateTime: meetingRecommendation.endDateTime,
      status: meetingRecommendation.status,
    });
  }

  toMeetingRecommendation(): MeetingRecommendation {
    return new MeetingRecommendation({
      fromUserId: this.userRelation.fromUser.id,
      toUserId: this.userRelation.toUser.id,
      startDateTime: this.startDateTime,
      endDateTime: this.endDateTime,
      status: this.status,
    });
  }
}
