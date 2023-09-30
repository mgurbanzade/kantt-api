import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailResolver } from './email.resolver';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { EmailConfirmationService } from './emailConfirmation.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@src/user/user.service';
import { PasswordResetService } from './passwordReset.service';

@Module({
  imports: [ConfigModule, EmailModule],
  controllers: [],
  providers: [
    EmailResolver,
    EmailService,
    EmailConfirmationService,
    PasswordResetService,
    ConfigService,
    JwtService,
    UserService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
