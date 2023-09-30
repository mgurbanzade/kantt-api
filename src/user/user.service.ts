import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from '@src/prisma/prisma.service';
import { ResetPasswordInput } from '@src/types/graphql';
@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async create(data: Prisma.UserCreateInput): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        ...data,
      },
    });

    return user;
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  findOne(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.findUnique({
      where,
    });
  }

  getUserProfile(userId: number): Promise<User> {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async resetPassword(data: ResetPasswordInput): Promise<User> {
    if (!data || !data.token || !data.password || !data.email) {
      throw new Error('Not enough data');
    }
    const { token, password, email } = data;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (
      !user.currentPasswordResetToken ||
      user.currentPasswordResetToken !== token
    ) {
      throw new Error('Invalid token');
    }

    const encPass = await bcrypt.hash(password, 10);

    return this.prisma.user.update({
      where: { email },
      data: { password: encPass, currentPasswordResetToken: null },
    });
  }

  remove(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.delete({
      where,
    });
  }

  async setCurrentRefreshToken(
    refreshToken: string,
    id: number,
  ): Promise<User> {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { currentHashedRefreshToken },
    });

    return updatedUser;
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, sub: number) {
    const user = await this.prisma.user.findUnique({ where: { id: sub } });
    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.currentHashedRefreshToken,
    );

    if (isRefreshTokenMatching) {
      return user;
    }
  }

  removeRefreshToken(userId: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        currentHashedRefreshToken: null,
      },
    });
  }

  async markEmailAsConfirmed(email: string) {
    return this.prisma.user.update({
      where: { email },
      data: {
        isEmailConfirmed: true,
      },
    });
  }

  // fields
}
