/**
 * Get user profile
 */

import * as userDao from '../../daos/userDao.ts';
import type { UserEntity } from '../../schemas/user.ts';
import type { AppContext, AppError } from '../../types.ts';

/**
 * Find user by username or throw if not found
 * @param username - Username
 */
async function findOrThrow(username: string): Promise<UserEntity> {
  const user = await userDao.findByUsername(null, username);

  if (!user) {
    const error = new Error(`User with username ${username} not found`) as AppError;
    error.status = 404;
    throw error;
  }

  return user;
}

/**
 * Get user profile (with isCurrentUser flag)
 * @param username - Username to fetch
 * @param currentUsername - Currently logged in username
 */
async function getUserProfile(
  username: string,
  currentUsername: string
): Promise<UserEntity & { isCurrentUser: boolean }> {
  const user = await findOrThrow(username);

  return {
    ...user,
    isCurrentUser: username === currentUsername,
  };
}

export default async (ctx: AppContext): Promise<void> => {
  // Get username from URL parameters
  const { username } = ctx.params;

  // Get current user's username
  // For authenticated endpoints, ctx.state.user is guaranteed to be defined by auth middleware
  const { username: currentUsername } = ctx.state.user as { username: string };

  // Get user profile with isCurrentUser flag
  const userProfile = await getUserProfile(username, currentUsername);

  // Return user profile
  ctx.body = userProfile;
};
