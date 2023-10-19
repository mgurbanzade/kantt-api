import { IsString } from 'class-validator';

export class GoalQueryDto {
  @IsString()
  body: string;
}

export default GoalQueryDto;
