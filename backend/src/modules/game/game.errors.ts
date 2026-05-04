import { NotFoundError, InvalidStateError, ValidationError } from '../../shared/errors.js';

export class GameNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`Game not found: ${id}`);
  }
}

export class InvalidStateTransitionError extends InvalidStateError {
  constructor(currentStatus: string, action: string) {
    super(`Cannot perform "${action}" on a game with status "${currentStatus}"`);
  }
}

export class InvalidSetScoreError extends ValidationError {
  constructor(p1: number, p2: number) {
    super(
      `Invalid set score ${p1}:${p2}. ` +
      'Winner must reach at least 11 points with a lead of at least 2.',
    );
  }
}

export class SetLimitExceededError extends ValidationError {
  constructor(format: string) {
    super(`Set limit for format ${format} has already been reached`);
  }
}
