import { Test, TestingModule } from '@nestjs/testing';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { Token } from './token.entity';

describe('TokenController', () => {
  let controller: TokenController;
  const mockTokenService = {
    createMemberToken: jest.fn(),
    createAdminToken: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenController],
      providers: [
        {
          provide: TokenService,
          useValue: mockTokenService,
        },
      ],
    }).compile();

    controller = module.get<TokenController>(TokenController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('/token/member => create member token', () => {
    it('should create a token object with accessToken property', async () => {
      const token = { accessToken: '' } as Token;

      jest
        .spyOn(mockTokenService, 'createMemberToken')
        .mockReturnValue({ accessToken: '' });

      const result = await controller.createMemberToken();

      expect(mockTokenService.createMemberToken).toHaveBeenCalled();
      expect(result).toEqual(token);
    });
  });

  describe('/token/admin => create admin token', () => {
    it('should create a token object with accessToken property', async () => {
      const token = { accessToken: '' } as Token;

      jest
        .spyOn(mockTokenService, 'createAdminToken')
        .mockReturnValue({ accessToken: '' });

      const result = await controller.createAdminToken();

      expect(mockTokenService.createAdminToken).toHaveBeenCalled();
      expect(result).toEqual(token);
    });
  });
});
