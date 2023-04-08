import * as Sentry from '@sentry/nextjs';

export function isAdmin(user: User | Admin | null): user is Admin {
  if (user === null) {
    return false;
  }

  if (user.roles === undefined) {
    Sentry.captureException('user.roles is undefined', {
      extra: {user},
    });

    return false;
  }

  return user.roles.some((r) => r.role === 'manager');
}
