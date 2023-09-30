import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/prisma/prisma.service';
import { UserService } from '@src/user/user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, PrismaService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should create a user', async () => {
  //   const user = await service.create({
  //     firstname: 'John',
  //     phone: '1234567890',
  //     type: 'RECRUITER',
  //     password: '123',
  //   });

  //   expect(user).toBeDefined();
  //   expect(user.firstname).toEqual('John');
  //   expect(user.phone).toEqual('1234567890');
  //   expect(user.type).toEqual('RECRUITER');
  // });
});
