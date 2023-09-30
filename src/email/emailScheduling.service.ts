import { Injectable } from '@nestjs/common';
import { EmailService } from './email.service';
import EmailScheduleDto from './dto/emailSchedule.dto';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export default class EmailSchedulingService {
  constructor(
    private readonly emailService: EmailService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  scheduleEmail(emailSchedule: EmailScheduleDto) {
    const date = new Date(emailSchedule.date).toDateString();
    const job = new CronJob(date, () => {
      this.emailService.sendMail({
        from: emailSchedule.from,
        to: emailSchedule.to,
        subject: emailSchedule.subject,
        template: emailSchedule.template,
        context: emailSchedule.context,
      });
    });

    this.schedulerRegistry.addCronJob(
      `${Date.now()}-${emailSchedule.subject}`,
      job as any,
    );
    job.start();
  }
}
