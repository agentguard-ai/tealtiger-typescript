/**
 * Custom Error Classes for TealTiger SDK
 * 
 * This file defines custom error classes for different types of errors
 * that can occur when using the TealTiger SDK
 */

import { TealTigerError, TealTigerErrorCode } from '../types';

/**
 * Base class for all TealTiger SDK errors
 */
export class BaseTealTigerError extends Error implements TealTigerError {
  public readonly code: TealTigerErrorCode;
  public readonly details?: Record<string, unknown> | undefined;
  public readonly cause?: Error | undefined;

  constructor(
    message: string,
    code: TealTigerErrorCode,
    details?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    
    // Handle optional properties explicitly for exactOptionalPropertyTypes
    if (details !== undefined) {
      this.details = details;
    }
    
    if (cause !== undefined) {
      this.cause = cause;
    }

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Convert error to JSON for logging/debugging
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      stack: this.stack,
      cause: this.cause?.message
    };
  }
}

/**
 * Configuration-related errors
 */
export class TealTigerConfigError extends BaseTealTigerError {
  constructor(
    message: string,
    code: TealTigerErrorCode = TealTigerErrorCode.INVALID_CONFIG,
    details?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, code, details, cause);
  }
}

/**
 * Network and communication errors
 */
export class TealTigerNetworkError extends BaseTealTigerError {
  constructor(
    message: string,
    code: TealTigerErrorCode = TealTigerErrorCode.NETWORK_ERROR,
    details?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, code, details, cause);
  }
}

/**
 * Server-side errors from the SSA
 */
export class TealTigerServerError extends BaseTealTigerError {
  constructor(
    message: string,
    code: TealTigerErrorCode = TealTigerErrorCode.SERVER_ERROR,
    details?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, code, details, cause);
  }
}

/**
 * Security-related errors (denied requests, policy violations)
 */
export class TealTigerSecurityError extends BaseTealTigerError {
  constructor(
    message: string,
    code: TealTigerErrorCode = TealTigerErrorCode.SECURITY_DENIED,
    details?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, code, details, cause);
  }
}

/**
 * Request validation errors
 */
export class TealTigerValidationError extends BaseTealTigerError {
  constructor(
    message: string,
    code: TealTigerErrorCode = TealTigerErrorCode.VALIDATION_ERROR,
    details?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, code, details, cause);
  }
}

/**
 * Authentication errors
 */
export class TealTigerAuthError extends BaseTealTigerError {
  constructor(
    message: string,
    code: TealTigerErrorCode = TealTigerErrorCode.AUTHENTICATION_ERROR,
    details?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, code, details, cause);
  }
}

/**
 * Utility function to create appropriate error based on error code
 */
export function createTealTigerError(
  message: string,
  code: TealTigerErrorCode,
  details?: Record<string, unknown>,
  cause?: Error
): TealTigerError {
  switch (code) {
    case TealTigerErrorCode.INVALID_CONFIG:
    case TealTigerErrorCode.MISSING_API_KEY:
    case TealTigerErrorCode.INVALID_SSA_URL:
      return new TealTigerConfigError(message, code, details, cause);

    case TealTigerErrorCode.NETWORK_ERROR:
    case TealTigerErrorCode.TIMEOUT_ERROR:
    case TealTigerErrorCode.CONNECTION_ERROR:
      return new TealTigerNetworkError(message, code, details, cause);

    case TealTigerErrorCode.AUTHENTICATION_ERROR:
    case TealTigerErrorCode.INVALID_API_KEY_FORMAT:
      return new TealTigerAuthError(message, code, details, cause);

    case TealTigerErrorCode.INVALID_REQUEST:
    case TealTigerErrorCode.VALIDATION_ERROR:
      return new TealTigerValidationError(message, code, details, cause);

    case TealTigerErrorCode.SERVER_ERROR:
    case TealTigerErrorCode.SERVICE_UNAVAILABLE:
      return new TealTigerServerError(message, code, details, cause);

    case TealTigerErrorCode.SECURITY_DENIED:
    case TealTigerErrorCode.POLICY_ERROR:
      return new TealTigerSecurityError(message, code, details, cause);

    default:
      return new BaseTealTigerError(message, code, details, cause);
  }
}

/**
 * Type guard to check if an error is an TealTiger error
 */
export function isTealTigerError(error: unknown): error is TealTigerError {
  return error instanceof BaseTealTigerError;
}

/**
 * Extract error details for logging
 */
export function getErrorDetails(error: unknown): Record<string, unknown> {
  if (isTealTigerError(error) && error instanceof BaseTealTigerError && typeof error.toJSON === 'function') {
    return error.toJSON();
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack
    };
  }

  return {
    error: String(error)
  };
}