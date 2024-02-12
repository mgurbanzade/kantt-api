import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '@src/auth/auth.service';
import { generateCookie } from './helpers';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const response = await this.authService.googleLogin(req.user.email);
    const { accessToken, refreshToken } = response;

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

    res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);

    res.send(`
      <script>
        window.location.href = "${process.env.FE_REDIRECT_URL}";
      </script>
    `);
  }
}
