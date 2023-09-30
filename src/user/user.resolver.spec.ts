import { Test, TestingModule } from '@nestjs/testing';
import { UserResolver } from '@src/user/user.resolver';
import { UserService } from '@src/user/user.service';
// import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

// const mockUser: Prisma.UserCreateInput = {
//   firstname: faker.name.firstName(),
//   password: faker.internet.password(),
//   phone: faker.phone.number(),
//   type: 'RECRUITER',
// };

const userServiceMock = {
  // findUser: jest.fn((id: number) => mockUser),
  // findAllUsers: jest.fn(() => [mockUser]),
  create: jest.fn((user: Prisma.UserCreateInput) => user),
};

describe('UserResolver', () => {
  let resolver: UserResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        {
          provide: UserService,
          useValue: userServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // it('should create a user', async () => {
  //   const user = await resolver.create(mockUser);
  //   expect(user).toBeDefined();
  //   expect(user).toEqual(mockUser);
  //   expect(user.firstname).toEqual(mockUser.firstname);
  // });
});
