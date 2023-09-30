import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { UserService } from '@src/user/user.service';
import { CurrentUser } from '@src/user/user.decorator';
import { ResetPasswordInput } from '@src/types/graphql';
import { JwtAuthGuard } from '@src/auth/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { UserGuard } from './guards/user.guard';
@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation('createUser')
  create(@Args('createUserInput') createUserInput: Prisma.UserCreateInput) {
    return this.userService.create(createUserInput);
  }

  @Query('getAllUsers')
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.userService.findAll();
  }

  @Query('getUser')
  @UseGuards(JwtAuthGuard)
  findOne(@Args('where') where: Prisma.UserWhereUniqueInput) {
    return this.userService.findOne(where);
  }

  @Query('getUserProfile')
  @UseGuards(JwtAuthGuard)
  getUserProfile(@CurrentUser() user: { userId: number }) {
    return this.userService.getUserProfile(user?.userId);
  }

  @Mutation('updateUser')
  @UseGuards(JwtAuthGuard, UserGuard)
  update(
    @Args('id') id: number,
    @Args('updateUserInput') updateUserInput: Prisma.UserUpdateInput,
  ) {
    return this.userService.update(id, updateUserInput);
  }

  @Mutation('resetPassword')
  resetPassword(
    @Args('resetPasswordInput') resetPasswordInput: ResetPasswordInput,
  ) {
    return this.userService.resetPassword(resetPasswordInput);
  }

  @Mutation('removeUser')
  @UseGuards(JwtAuthGuard, UserGuard)
  remove(@Args('id') id: number) {
    return this.userService.remove({ id });
  }
}
