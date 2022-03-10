import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of usersservuce
    const users: User[] = [];
    fakeUsersService = {
      find: (email) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user woth hashed password', async () => {
    const user = await service.signup('testTest@test.com', 'pass1234');

    expect(user.password).not.toEqual('pass1234');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user exists', (done) => {
    fakeUsersService.find = () =>
      Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);

    service.signup('testTest@test.com', 'pass1234').catch(() => done());
  });

  it('throws an error if user doesnt exist - Sign In', (done) => {
    service.signin('testTest@test.com', 'pass1234').catch(() => done());
  });

  it('throws and error if password is invalid - Sign In', (done) => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'whateva@test.com', password: 'sadadad' } as User,
      ]);

    service.signin('whateva@test.com', 'passworded').catch(() => done());
  });

  it('returns a user if correct password - Sign in', async () => {
    await service.signup('test@test.com', 'pass1234');

    const user = await service.signin('test@test.com', 'pass1234');
    expect(user).toBeDefined();
  });
});
