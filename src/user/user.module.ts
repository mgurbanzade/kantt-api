import { Module } from '@nestjs/common';
import { UserService } from '@src/user/user.service';
import { UserResolver } from '@src/user/user.resolver';

@Module({
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
