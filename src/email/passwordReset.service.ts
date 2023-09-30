import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '@src/email/email.service';
import { UserService } from '../user/user.service';

@Injectable()
export class PasswordResetService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly usersService: UserService,
  ) {}

  async sendPasswordResetLink(email: string) {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user.currentPasswordResetToken) {
      try {
        const decodedEmail = await this.decodePasswordResetToken(
          user.currentPasswordResetToken,
        );

        if (decodedEmail === email) {
          throw new BadRequestException('Password reset link already sent');
        }
      } catch (error) {
        if (error?.name === 'TokenExpiredError') {
          await this.usersService.update(user.id, {
            currentPasswordResetToken: null,
          });
        } else if (error.message === 'Password reset link already sent') {
          throw new BadRequestException(error.message);
        }
      }
    }

    const token = this.jwtService.sign(
      { email },
      {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
        expiresIn: `${this.configService.get(
          'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
        )}s`,
      },
    );

    await this.usersService.update(user.id, {
      currentPasswordResetToken: token,
    });

    const url = `${this.configService.get(
      'PASSWORD_RESET_URL',
    )}?token=${token}&email=${email}`;

    await this.emailService.sendMail({
      to: email,
      from: this.configService.get('EMAIL'),
      subject: 'Reset password',
      template: 'reset-password',
      context: {
        name: user.firstname,
        resetUrl: url,
        expirationInHours:
          this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME') /
          60 /
          60,
      },
    });

    return { success: true };
  }

  async decodePasswordResetToken(token: string) {
    const payload = await this.jwtService.verify(token, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
    });

    if (typeof payload === 'object' && 'email' in payload) {
      return payload.email;
    }

    throw new BadRequestException();
  }
}
