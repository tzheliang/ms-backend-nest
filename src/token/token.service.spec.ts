import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import { JwtService } from '@nestjs/jwt';
import { Token } from './token.entity';

describe('TokenService', () => {
  let tokenService: TokenService;
  const mockJwtService = { signAsync: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    tokenService = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(tokenService).toBeDefined();
  });

  describe('create member token', () => {
    it('should return an object with accessToken property', async () => {
      const signedJwt = {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoibWVtYmVyIiwiaWF0IjoxNzIwODg0OTQ1LCJleHAiOjE3MjA4ODUyNDV9.q8rLURUuK_Vbtf2JQoIQtMTTESOBN-XdGOz6dXEynj0',
      } as Token;

      jest
        .spyOn(mockJwtService, 'signAsync')
        .mockReturnValue(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoibWVtYmVyIiwiaWF0IjoxNzIwODg0OTQ1LCJleHAiOjE3MjA4ODUyNDV9.q8rLURUuK_Vbtf2JQoIQtMTTESOBN-XdGOz6dXEynj0',
        );

      const result = await tokenService.createMemberToken();

      expect(mockJwtService.signAsync).toHaveBeenCalled();
      expect(result).toEqual(signedJwt);
    });
  });

  describe('create admin token', () => {
    it('should return an object with accessToken property', async () => {
      const signedJwt = {
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjA4ODQ5NjAsImV4cCI6MTcyMDg4NTI2MH0.NgyI_ZV-5Ns4yv4YnahWSzXrYiGjg-iwZqVHZqookJk',
      } as Token;

      jest
        .spyOn(mockJwtService, 'signAsync')
        .mockReturnValue(
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MjA4ODQ5NjAsImV4cCI6MTcyMDg4NTI2MH0.NgyI_ZV-5Ns4yv4YnahWSzXrYiGjg-iwZqVHZqookJk',
        );

      const result = await tokenService.createAdminToken();

      expect(mockJwtService.signAsync).toHaveBeenCalled();
      expect(result).toEqual(signedJwt);
    });
  });
});
