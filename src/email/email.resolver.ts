import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { EmailConfirmationService } from '@src/email/emailConfirmation.service';
import { PasswordResetService } from './passwordReset.service';

@Resolver('Email')
export class EmailResolver {
  constructor(
    private readonly emailConfirmationService: EmailConfirmationService,
    private readonly passwordResetService: PasswordResetService,
  ) {}

  @Mutation('verifyAccount')
  verifyAccount(@Args('token') token: string) {
    return this.emailConfirmationService.verifyAccount(token);
  }

  @Mutation('resendVerificationLink')
  resendVerificationLink(@Args('email') email: string) {
    return this.emailConfirmationService.resendVerificationLink(email);
  }

  @Mutation('sendPasswordResetLink')
  sendPasswordResetLink(@Args('email') email: string) {
    return this.passwordResetService.sendPasswordResetLink(email);
  }
}
