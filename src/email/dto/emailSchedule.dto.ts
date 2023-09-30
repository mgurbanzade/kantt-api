import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsEmail,
  IsObject,
} from 'class-validator';

export class EmailScheduleDto {
  @IsEmail()
  from: string;

  @IsEmail()
  to: string;

  @IsString()
  @IsNotEmpty()
  subject: string;

  @IsString()
  @IsNotEmpty()
  template: string;

  @IsDateString()
  date: string;

  @IsObject()
  context: any;
}

export default EmailScheduleDto;
