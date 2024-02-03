import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { UserService } from '@src/user/user.service';
// import { EmailService } from '@src/email/email.service';
import { EmailConfirmationService } from '@src/email/emailConfirmation.service';
import {
  GetCurrentUserResponse,
  LoginResponse,
  LogoutResponse,
  SignupResponse,
  SignupUserInput,
} from '@src/types/graphql';
import { generateCookie } from './helpers';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly emailConfirmationService: EmailConfirmationService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne({ email });

    try {
      const passwordMatches = await bcrypt.compare(pass, user?.password);
      if (user && passwordMatches) return user;
    } catch (error) {
      throw new Error('Invalid credentials');
    }
  }

  async login(ctx: any): Promise<LoginResponse> {
    const user = ctx?.user;

    if (!user) {
      throw new Error('User not found');
    }

    const accessToken = this.jwtService.sign(
      {
        email: user.email,
        sub: user.id,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: `${process.env.JWT_EXPIRATION_TIME_SEC}s`,
      },
    );

    const refreshToken = this.jwtService.sign(
      {
        email: user.email,
        sub: user.id,
      },
      {
        secret: process.env.JWT_RT_SECRET,
        expiresIn: `${process.env.JWT_RT_EXPIRATION_TIME_SEC}s`,
      },
    );

    const accessTokenCookie = generateCookie(
      'Authentication',
      accessToken,
      process.env.JWT_EXPIRATION_TIME_SEC,
    );

    const refreshTokenCookie = generateCookie(
      'Refresh',
      refreshToken,
      process.env.JWT_RT_EXPIRATION_TIME_SEC,
    );

    ctx.req.res.setHeader('Set-Cookie', [
      accessTokenCookie,
      refreshTokenCookie,
    ]);

    this.userService.setCurrentRefreshToken(refreshToken, user.id);

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refresh(ctx: any): Promise<any> {
    const user = ctx?.req?.user;
    if (!user) throw new Error('User not found');

    const accessToken = this.jwtService.sign(
      {
        email: user.email,
        sub: user.id,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: `${process.env.JWT_EXPIRATION_TIME_SEC}s`,
      },
    );

    const accessTokenCookie = generateCookie(
      'Authentication',
      accessToken,
      process.env.JWT_EXPIRATION_TIME_SEC,
    );

    ctx.req.res.setHeader('Set-Cookie', accessTokenCookie);

    return {
      expSeconds: process.env.JWT_EXPIRATION_TIME_SEC,
      accessToken,
      user,
    };
  }

  async getCurrentUser(ctx: any): Promise<GetCurrentUserResponse> {
    const accessToken = ctx.req.cookies.Authentication;
    const refreshToken = ctx.req.cookies.Refresh;
    if (!accessToken && refreshToken) {
      console.log('CURRENT UUSER', ctx?.req?.user);
    }

    const data = this.jwtService.verify(accessToken, {
      secret: process.env.JWT_SECRET,
    });

    const user = await this.userService.findOne({ id: data.sub });
    if (user.password) user.password = null;
    return { user };
  }

  async logout(ctx): Promise<LogoutResponse> {
    if (!ctx?.req?.user.userId) throw new Error('User is not present');
    const domain =
      process.env.NODE_ENV === 'development' ? 'localhost' : 'kantt.io';

    const accessCookie = `Authentication=; Domain=${domain}; HttpOnly; Path=/; Max-Age=0`;
    const refreshCookie = `Refresh=; Domain=${domain}; HttpOnly; Path=/; Max-Age=0`;

    ctx.req.res.setHeader('Set-Cookie', [accessCookie, refreshCookie]);

    await this.userService.removeRefreshToken(ctx.req.user.userId);

    return {
      success: true,
    };
  }

  async signup(signupUserInput: SignupUserInput): Promise<SignupResponse> {
    const { password } = signupUserInput;
    const encPass = await bcrypt.hash(password, 10);

    const user = await this.userService.findOne({
      email: signupUserInput.email,
    });

    if (user) {
      throw new Error('User already exists');
    }

    const newUser = await this.userService.create({
      ...signupUserInput,
      password: encPass,
    });

    // await this.emailConfirmationService.sendVerificationLink(
    //   newUser.email,
    //   newUser.firstname,
    // );

    return {
      user: newUser,
    };
  }
}
