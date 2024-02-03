import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import VerificationTokenPayload from './verificationTokenPayload.interface';
import { EmailService } from '@src/email/email.service';
import { UserService } from '../user/user.service';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly usersService: UserService,
  ) {}

  public sendVerificationLink(email: string, name: string) {
    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}&email=${email}`;

    return this.emailService.sendMail({
      to: email,
      from: this.configService.get('EMAIL'),
      subject: 'Welcome to Kantt!',
      template: 'account-verification',
      context: {
        name,
        expirationInHours:
          this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME') /
          60 /
          60,
        verificationLink: url,
      },
    });
  }

  public async confirmEmail(email: string) {
    const user = await this.usersService.findOne({ email });
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    await this.usersService.markEmailAsConfirmed(email);

    return {
      success: true,
    };
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }

      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Confirmation token is expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async verifyAccount(token: string) {
    const email = await this.decodeConfirmationToken(token);
    const result = await this.confirmEmail(email);

    return result;
  }

  public async resendVerificationLink(email: string) {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const user = await this.usersService.findOne({ email });
    if (user.isEmailConfirmed) {
      throw new BadRequestException('Email already confirmed');
    }

    const payload: VerificationTokenPayload = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get(
        'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
      )}s`,
    });

    const url = `${this.configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}&email=${email}`;

    await this.emailService.sendMail({
      to: email,
      from: this.configService.get('EMAIL'),
      subject: 'Verification link',
      template: 'resend-verification',
      context: {
        expirationInHours:
          this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME') /
          60 /
          60,
        verificationLink: url,
      },
    });

    return {
      success: true,
    };
  }
}
