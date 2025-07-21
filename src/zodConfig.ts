import * as z from 'zod/v4';
import { BadRequestError } from './httpErrors.ts';

export default function initializeErrorHandler() {
  z.config({
    customError: (issue) => {
      let message = '';
      if (issue.code === 'invalid_type') {
        if (issue.input === undefined) {
          message = `field(s) missing from payload: '${issue.path?.join(',')}'`;
          throw new BadRequestError(message, 'MISSING_KEY');
        }
        message = `'${issue.path?.join(',')}' expected type is ${issue.expected} but received ${issue.received}`;
      } else if (issue.code === 'unrecognized_keys') {
        message = `unrecognized field(s) in payload: '${issue.keys.join(', ')}'`;
        throw new BadRequestError(message, 'UNEXPECTED_KEY');
      } else if (issue.code === 'too_small') {
        if (issue.origin === 'string') {
          message = `'${issue.path?.join(',')}' must be at least ${issue.minimum} character(s)`;
        } else if (issue.origin === 'number') {
          message = `'${issue.path?.join(',')}' must be greater than or equal to ${issue.minimum}`;
        } else if (issue.origin === 'array') {
          message = `'${issue.path?.join(',')}' must have at least ${issue.minimum} item(s)`;
        }
        throw new BadRequestError(message, 'INPUT_TOO_SMALL');
      } else if (issue.code === 'too_big') {
        if (issue.origin === 'string') {
          message = `field '${issue.path?.join(',')}' must be at most ${issue.maximum} character(s)`;
        } else if (issue.origin === 'number') {
          message = `field '${issue.path?.join(',')}' must be less than or equal to ${issue.maximum}`;
        } else if (issue.origin === 'array') {
          message = `field '${issue.path?.join(',')}' must have at most ${issue.maximum} item(s)`;
        }
        throw new BadRequestError(message, 'INPUT_TOO_BIG');
      } else if (issue.code === 'invalid_format') {
        message = `field '${issue.path?.join(',')}' is an invalid '${issue.format}'`;
        throw new BadRequestError(message, 'BAD_FORMAT');
      }

      throw new BadRequestError(message, 'BAD_INPUT');
    },
  });
}
