import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    let user = null;
    try {
      user = await this.authService.validateUser(email, password);
    } catch (err) {
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
    }

    return user;
  }
}
