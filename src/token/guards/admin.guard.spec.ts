import { Test, TestingModule } from '@nestjs/testing';
import { AdminGuard } from './admin.guard';
import { TokenPayload } from '../token-payload.entity';
import {
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';

describe('AdminGuard', () => {
  let guard: AdminGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminGuard],
    }).compile();

    guard = module.get<AdminGuard>(AdminGuard);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('guard should activate when the user role in payload is "admin"', () => {
    it('should return true when role is admin', () => {
      // mock the context
      const mockExecutionContext = createMock<ExecutionContext>({
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            user: { role: 'admin' } as TokenPayload,
          })),
        })),
      });

      expect(guard.canActivate(mockExecutionContext)).toEqual(true);
    });

    it('should throw forbidden exception when user role is not admin', () => {
      // mock the context
      const mockExecutionContext = createMock<ExecutionContext>({
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            user: { role: 'member' } as TokenPayload,
          })),
        })),
      });

      expect(() => {
        guard.canActivate(mockExecutionContext);
      }).toThrow(ForbiddenException);
    });

    it('should throw unathorized exception when user payload does not exist', () => {
      // mock the context
      const mockExecutionContext = createMock<ExecutionContext>({
        switchToHttp: jest.fn(() => ({
          getRequest: jest.fn(() => ({
            user: null,
          })),
        })),
      });

      expect(() => {
        guard.canActivate(mockExecutionContext);
      }).toThrow(UnauthorizedException);
    });
  });
});
