import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';

describe('AdminGuard', () => {
  let guard: AuthGuard;
  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('guard should activate when the request has a valid JWT', () => {
    beforeEach(() => {
      mockJwtService.verifyAsync.mockClear();
    });

    it('should return true when a valid Bearer JWT is provided', async () => {
      // mock the context
      const mockExecutionContext = createMock<ExecutionContext>({
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            headers: { authorization: 'Bearer VALID_JWT_TOKEN' },
          })),
        })),
      });

      jest
        .spyOn(mockJwtService, 'verifyAsync')
        .mockReturnValue({ role: 'member' });

      await expect(guard.canActivate(mockExecutionContext)).resolves.toEqual(
        true,
      );

      expect(mockJwtService.verifyAsync).toHaveBeenCalled();
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(
        'VALID_JWT_TOKEN',
      );
    });

    it('should throw unauthorized exception when not provided a Bearer JWT', async () => {
      // mock the context
      const mockExecutionContext = createMock<ExecutionContext>({
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            headers: { authorization: 'NotBearer VALID_JWT_TOKEN' },
          })),
        })),
      });

      jest.spyOn(mockJwtService, 'verifyAsync');

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw unathorized exception when JWT has expired', async () => {
      // mock the context
      const mockExecutionContext = createMock<ExecutionContext>({
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            headers: { authorization: 'Bearer EXPIRED_JWT' },
          })),
        })),
      });

      jest
        .spyOn(mockJwtService, 'verifyAsync')
        .mockRejectedValue(new TokenExpiredError('EXPIRED', new Date()));

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockJwtService.verifyAsync).toHaveBeenCalled();
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('EXPIRED_JWT');
    });

    it('should throw unathorized exception when provided with invalid JWT', async () => {
      // mock the context
      const mockExecutionContext = createMock<ExecutionContext>({
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            headers: { authorization: 'Bearer INVALID_JWT' },
          })),
        })),
      });

      jest.spyOn(mockJwtService, 'verifyAsync').mockRejectedValue(new Error());

      await expect(guard.canActivate(mockExecutionContext)).rejects.toThrow(
        UnauthorizedException,
      );

      expect(mockJwtService.verifyAsync).toHaveBeenCalled();
      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('INVALID_JWT');
    });
  });
});
