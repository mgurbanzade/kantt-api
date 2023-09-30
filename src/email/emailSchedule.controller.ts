import { Body, Controller, UseGuards, Post } from '@nestjs/common';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import EmailSchedulingService from './emailScheduling.service';
import EmailScheduleDto from './dto/emailSchedule.dto';

@Controller('email-scheduling')
export default class EmailSchedulingController {
  constructor(
    private readonly emailSchedulingService: EmailSchedulingService,
  ) {}

  @Post('schedule')
  @UseGuards(JwtAuthGuard)
  async scheduleEmail(@Body() emailSchedule: EmailScheduleDto) {
    this.emailSchedulingService.scheduleEmail(emailSchedule);
  }
}
