/**
 * Basic Error interface used for File System operation.
 * All File System errors extend this interface.
 */

type FSErrorCode = 'ENOENT' | 'UNKNOWN';

export interface FSError {
  type: FSErrorCode;
}

export interface NoEntity extends FSError {
  type: 'ENOENT';
  path: string;
}

export interface UnknownError extends FSError {
  type: 'UNKNOWN';
  message: string;
}
