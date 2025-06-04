/**
 * Zod configuration
 * This file sets up global configuration for Zod validation
 */

import { z } from 'zod';

export default function initializeErrorHandler() {
  // Configure Zod error formatting
  z.setErrorMap((issue, ctx) => {
    // Set a default message that will be overridden in most cases
    let message = ctx.defaultError;
    if (issue.code === z.ZodIssueCode.invalid_type) {
      if (issue.received === 'undefined' || issue.received === 'null') {
        message = 'This field is required';
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
    } else if (issue.code === z.ZodIssueCode.unrecognized_keys) {
      message = `Unrecognized field(s): ${issue.keys.join(', ')}`;
    } else if (issue.code === z.ZodIssueCode.invalid_string) {
      if (issue.validation === 'email') {
        message = 'Must be a valid email address';
      } else if (issue.validation === 'url') {
        message = 'Must be a valid URL';
      } else if (issue.validation === 'regex') {
        message = 'Must match the required format';
      } else {
        message = `Invalid string - ${ctx.defaultError}`;
      }
    } else if (issue.code === z.ZodIssueCode.too_small) {
      if (issue.type === 'string') {
        message = `Must be at least ${issue.minimum} character(s)`;
      } else if (issue.type === 'number') {
        message = `Must be greater than or equal to ${issue.minimum}`;
      } else if (issue.type === 'array') {
        message = `Must have at least ${issue.minimum} item(s)`;
      }
    } else if (issue.code === z.ZodIssueCode.too_big) {
      if (issue.type === 'string') {
        message = `Must be at most ${issue.maximum} character(s)`;
      } else if (issue.type === 'number') {
        message = `Must be less than or equal to ${issue.maximum}`;
      } else if (issue.type === 'array') {
        message = `Must have at most ${issue.maximum} item(s)`;
      }
    }

    return { message };
  });
}
