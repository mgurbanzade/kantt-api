import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from '@src/auth/local.strategy';
import { AuthService } from '@src/auth/auth.service';
import { UserService } from '@src/user/user.service';
import { UserModule } from '@src/user/user.module';
import { AuthResolver } from '@src/auth/auth.resolver';
import { JwtStrategy } from '@src/auth/jwt.strategy';
import { JwtRefreshTokenStrategy } from '@src/auth/jwt-rt.strategy';
import { ConfigService } from '@nestjs/config';
import { EmailConfirmationService } from '@src/email/emailConfirmation.service';
import { EmailService } from '@src/email/email.service';
import { GoogleStrategy } from './google-oauth.strategy';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule,
    UserModule,
    JwtModule.register({
      signOptions: { expiresIn: `${process.env.JWT_EXPIRATION_TIME_SEC}s` }, // 's' is required!!!
      secret: process.env.JWT_SECRET,
    }),
  ],
  providers: [
    ConfigService,
    AuthService,
    AuthResolver,
    UserService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    EmailService,
    EmailConfirmationService,
    GoogleStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
