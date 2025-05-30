import { ApiProperty } from '@nestjs/swagger';
import { BaseUserDto } from './user.dto';

export class CreateMentorDto extends BaseUserDto {
  @ApiProperty()
  userName: string;

  @ApiProperty()
  pass: string;
}
