import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class SessionCompleteDto {
  @ApiProperty()
  @IsUUID()
  sessionId!: string;
}
