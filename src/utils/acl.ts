export function isAdmin(user: User | Admin | null): user is Admin {
  return user !== null && user.roles.includes('ROLE_ADMIN');
}
