import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from '@src/auth/auth.service';
import {
  LoginUserInput,
  SignupUserInput,
  LogoutResponse,
  User,
} from '@src/types/graphql';
import { GqlAuthGuard } from '@src/auth/gql-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import JwtRefreshTokenGuard from './jwt-rt.guard';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation('login')
  @UseGuards(GqlAuthGuard)
  login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context() ctx,
  ) {
    return this.authService.login(ctx);
  }

  @Mutation('signup')
  signup(@Args('signupUserInput') signupUserInput: SignupUserInput) {
    return this.authService.signup(signupUserInput);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@Context() ctx) {
    return this.authService.getCurrentUser(ctx);
  }

  @Query(() => User)
  @UseGuards(JwtRefreshTokenGuard)
  refresh(@Context() ctx) {
    return this.authService.refresh(ctx);
  }

  @Mutation(() => LogoutResponse)
  @UseGuards(JwtAuthGuard)
  @UseGuards(JwtRefreshTokenGuard)
  logout(@Context() ctx): Promise<LogoutResponse> {
    return this.authService.logout(ctx);
  }
}
