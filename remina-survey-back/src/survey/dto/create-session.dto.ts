import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ enum: ['-18', '18-25', '26-35', '36-45', '46-60', '60+'] })
  @IsString()
  @IsIn(['-18', '18-25', '26-35', '36-45', '46-60', '60+'])
  ageGroup!: string;

  @ApiProperty({ enum: ['Homme', 'Femme', 'Autre', 'Préfère ne pas dire'] })
  @IsString()
  @IsIn(['Homme', 'Femme', 'Autre', 'Préfère ne pas dire'])
  gender!: string;
}
