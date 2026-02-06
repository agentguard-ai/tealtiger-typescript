/**
 * Error Classes Unit Tests
 */

import {
  BaseTealTigerError,
  TealTigerConfigError,
  TealTigerNetworkError,
  TealTigerServerError,
  TealTigerSecurityError,
  TealTigerValidationError,
  TealTigerAuthError,
  createTealTigerError,
  isTealTigerError,
  getErrorDetails
} from '../errors';
import { TealTigerErrorCode } from '../../types';

describe('Error Classes', () => {
  describe('BaseTealTigerError', () => {
    it('should create error with required properties', () => {
      const error = new BaseTealTigerError(
        'Test error message',
        TealTigerErrorCode.VALIDATION_ERROR
      );

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(BaseTealTigerError);
      expect(error.message).toBe('Test error message');
      expect(error.code).toBe(TealTigerErrorCode.VALIDATION_ERROR);
      expect(error.name).toBe('BaseTealTigerError');
    });

    it('should create error with optional details and cause', () => {
      const cause = new Error('Original error');
      const details = { requestId: '123', userId: 'user456' };

      const error = new BaseTealTigerError(
        'Test error message',
        TealTigerErrorCode.NETWORK_ERROR,
        details,
        cause
      );

      expect(error.details).toEqual(details);
      expect(error.cause).toBe(cause);
    });

    it('should have proper stack trace', () => {
      const error = new BaseTealTigerError(
        'Test error',
        TealTigerErrorCode.VALIDATION_ERROR
      );

      expect(error.stack).toBeDefined();
      expect(error.stack).toContain('BaseTealTigerError');
    });

    it('should serialize to JSON correctly', () => {
      const cause = new Error('Original error');
      const details = { requestId: '123' };

      const error = new BaseTealTigerError(
        'Test error message',
        TealTigerErrorCode.SERVER_ERROR,
        details,
        cause
      );

      const json = error.toJSON();

      expect(json).toEqual({
        name: 'BaseTealTigerError',
        message: 'Test error message',
        code: TealTigerErrorCode.SERVER_ERROR,
        details: { requestId: '123' },
        stack: error.stack,
        cause: 'Original error'
      });
    });

    it('should handle undefined details and cause', () => {
      const error = new BaseTealTigerError(
        'Test error',
        TealTigerErrorCode.VALIDATION_ERROR
      );

      expect(error.details).toBeUndefined();
      expect(error.cause).toBeUndefined();

      const json = error.toJSON();
      expect(json.details).toBeUndefined();
      expect(json.cause).toBeUndefined();
    });
  });

  describe('Specific Error Classes', () => {
    it('should create TealTigerConfigError with default code', () => {
      const error = new TealTigerConfigError('Config error');

      expect(error).toBeInstanceOf(BaseTealTigerError);
      expect(error).toBeInstanceOf(TealTigerConfigError);
      expect(error.code).toBe(TealTigerErrorCode.INVALID_CONFIG);
      expect(error.message).toBe('Config error');
      expect(error.name).toBe('TealTigerConfigError');
    });

    it('should create TealTigerNetworkError with default code', () => {
      const error = new TealTigerNetworkError('Network error');

      expect(error).toBeInstanceOf(BaseTealTigerError);
      expect(error).toBeInstanceOf(TealTigerNetworkError);
      expect(error.code).toBe(TealTigerErrorCode.NETWORK_ERROR);
      expect(error.message).toBe('Network error');
      expect(error.name).toBe('TealTigerNetworkError');
    });

    it('should create TealTigerServerError with default code', () => {
      const error = new TealTigerServerError('Server error');

      expect(error).toBeInstanceOf(BaseTealTigerError);
      expect(error).toBeInstanceOf(TealTigerServerError);
      expect(error.code).toBe(TealTigerErrorCode.SERVER_ERROR);
      expect(error.message).toBe('Server error');
      expect(error.name).toBe('TealTigerServerError');
    });

    it('should create TealTigerSecurityError with default code', () => {
      const error = new TealTigerSecurityError('Security error');

      expect(error).toBeInstanceOf(BaseTealTigerError);
      expect(error).toBeInstanceOf(TealTigerSecurityError);
      expect(error.code).toBe(TealTigerErrorCode.SECURITY_DENIED);
      expect(error.message).toBe('Security error');
      expect(error.name).toBe('TealTigerSecurityError');
    });

    it('should create TealTigerValidationError with default code', () => {
      const error = new TealTigerValidationError('Validation error');

      expect(error).toBeInstanceOf(BaseTealTigerError);
      expect(error).toBeInstanceOf(TealTigerValidationError);
      expect(error.code).toBe(TealTigerErrorCode.VALIDATION_ERROR);
      expect(error.message).toBe('Validation error');
      expect(error.name).toBe('TealTigerValidationError');
    });

    it('should create TealTigerAuthError with default code', () => {
      const error = new TealTigerAuthError('Auth error');

      expect(error).toBeInstanceOf(BaseTealTigerError);
      expect(error).toBeInstanceOf(TealTigerAuthError);
      expect(error.code).toBe(TealTigerErrorCode.AUTHENTICATION_ERROR);
      expect(error.message).toBe('Auth error');
      expect(error.name).toBe('TealTigerAuthError');
    });

    it('should allow custom error codes', () => {
      const error = new TealTigerConfigError(
        'Custom config error',
        TealTigerErrorCode.MISSING_API_KEY
      );

      expect(error.code).toBe(TealTigerErrorCode.MISSING_API_KEY);
    });

    it('should accept details and cause parameters', () => {
      const cause = new Error('Original error');
      const details = { field: 'apiKey' };

      const error = new TealTigerValidationError(
        'Validation failed',
        TealTigerErrorCode.VALIDATION_ERROR,
        details,
        cause
      );

      expect(error.details).toEqual(details);
      expect(error.cause).toBe(cause);
    });
  });

  describe('createTealTigerError', () => {
    it('should create appropriate error types based on error codes', () => {
      const testCases = [
        {
          code: TealTigerErrorCode.INVALID_CONFIG,
          expectedType: TealTigerConfigError
        },
        {
          code: TealTigerErrorCode.MISSING_API_KEY,
          expectedType: TealTigerConfigError
        },
        {
          code: TealTigerErrorCode.INVALID_SSA_URL,
          expectedType: TealTigerConfigError
        },
        {
          code: TealTigerErrorCode.NETWORK_ERROR,
          expectedType: TealTigerNetworkError
        },
        {
          code: TealTigerErrorCode.TIMEOUT_ERROR,
          expectedType: TealTigerNetworkError
        },
        {
          code: TealTigerErrorCode.CONNECTION_ERROR,
          expectedType: TealTigerNetworkError
        },
        {
          code: TealTigerErrorCode.AUTHENTICATION_ERROR,
          expectedType: TealTigerAuthError
        },
        {
          code: TealTigerErrorCode.INVALID_API_KEY_FORMAT,
          expectedType: TealTigerAuthError
        },
        {
          code: TealTigerErrorCode.INVALID_REQUEST,
          expectedType: TealTigerValidationError
        },
        {
          code: TealTigerErrorCode.VALIDATION_ERROR,
          expectedType: TealTigerValidationError
        },
        {
          code: TealTigerErrorCode.SERVER_ERROR,
          expectedType: TealTigerServerError
        },
        {
          code: TealTigerErrorCode.SERVICE_UNAVAILABLE,
          expectedType: TealTigerServerError
        },
        {
          code: TealTigerErrorCode.SECURITY_DENIED,
          expectedType: TealTigerSecurityError
        },
        {
          code: TealTigerErrorCode.POLICY_ERROR,
          expectedType: TealTigerSecurityError
        }
      ];

      testCases.forEach(({ code, expectedType }) => {
        const error = createTealTigerError('Test message', code);
        expect(error).toBeInstanceOf(expectedType);
        expect(error.code).toBe(code);
        expect(error.message).toBe('Test message');
      });
    });

    it('should create BaseTealTigerError for unknown codes', () => {
      const unknownCode = 'UNKNOWN_ERROR' as TealTigerErrorCode;
      const error = createTealTigerError('Unknown error', unknownCode);

      expect(error).toBeInstanceOf(BaseTealTigerError);
      expect(error.code).toBe(unknownCode);
    });

    it('should pass details and cause to created errors', () => {
      const cause = new Error('Original error');
      const details = { requestId: '123' };

      const error = createTealTigerError(
        'Test message',
        TealTigerErrorCode.NETWORK_ERROR,
        details,
        cause
      );

      expect(error.details).toEqual(details);
      expect(error.cause).toBe(cause);
    });
  });

  describe('isTealTigerError', () => {
    it('should return true for TealTiger errors', () => {
      const errors = [
        new BaseTealTigerError('Test', TealTigerErrorCode.VALIDATION_ERROR),
        new TealTigerConfigError('Config error'),
        new TealTigerNetworkError('Network error'),
        new TealTigerServerError('Server error'),
        new TealTigerSecurityError('Security error'),
        new TealTigerValidationError('Validation error'),
        new TealTigerAuthError('Auth error')
      ];

      errors.forEach(error => {
        expect(isTealTigerError(error)).toBe(true);
      });
    });

    it('should return false for non-TealTiger errors', () => {
      const nonTealTigerErrors = [
        new Error('Regular error'),
        new TypeError('Type error'),
        new ReferenceError('Reference error'),
        'string error',
        123,
        null,
        undefined,
        {},
        []
      ];

      nonTealTigerErrors.forEach(error => {
        expect(isTealTigerError(error)).toBe(false);
      });
    });
  });

  describe('getErrorDetails', () => {
    it('should extract details from TealTiger errors', () => {
      const error = new BaseTealTigerError(
        'Test error',
        TealTigerErrorCode.VALIDATION_ERROR,
        { field: 'apiKey' },
        new Error('Cause')
      );

      const details = getErrorDetails(error);

      expect(details).toEqual({
        name: 'BaseTealTigerError',
        message: 'Test error',
        code: TealTigerErrorCode.VALIDATION_ERROR,
        details: { field: 'apiKey' },
        stack: error.stack,
        cause: 'Cause'
      });
    });

    it('should extract details from regular errors', () => {
      const error = new Error('Regular error');
      error.stack = 'Error stack trace';

      const details = getErrorDetails(error);

      expect(details).toEqual({
        name: 'Error',
        message: 'Regular error',
        stack: 'Error stack trace'
      });
    });

    it('should handle non-error values', () => {
      const testCases = [
        { input: 'string error', expected: { error: 'string error' } },
        { input: 123, expected: { error: '123' } },
        { input: null, expected: { error: 'null' } },
        { input: undefined, expected: { error: 'undefined' } },
        { input: {}, expected: { error: '[object Object]' } },
        { input: [], expected: { error: '' } }
      ];

      testCases.forEach(({ input, expected }) => {
        const details = getErrorDetails(input);
        expect(details).toEqual(expected);
      });
    });

    it('should handle TealTiger errors without toJSON method', () => {
      // Create a regular error that will be handled by the Error branch
      const mockError = new Error('Mock error');
      mockError.name = 'MockTealTigerError';
      delete (mockError as any).stack;

      const details = getErrorDetails(mockError);

      expect(details).toEqual({
        name: 'MockTealTigerError',
        message: 'Mock error',
        stack: undefined
      });
    });
  });

  describe('Error Inheritance', () => {
    it('should maintain proper inheritance chain', () => {
      const error = new TealTigerValidationError('Test error');

      expect(error instanceof Error).toBe(true);
      expect(error instanceof BaseTealTigerError).toBe(true);
      expect(error instanceof TealTigerValidationError).toBe(true);
    });

    it('should be catchable as Error', () => {
      expect(() => {
        throw new TealTigerConfigError('Config error');
      }).toThrow(Error);
    });

    it('should be catchable as BaseTealTigerError', () => {
      expect(() => {
        throw new TealTigerNetworkError('Network error');
      }).toThrow(BaseTealTigerError);
    });
  });
});