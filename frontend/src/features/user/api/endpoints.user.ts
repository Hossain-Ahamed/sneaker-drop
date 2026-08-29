export const userAPIEndpoints = {
  /** POST /users
   * create user
   */
  create: "/users",

  /** POST /users/signin
   * sign in an existing user by username
   */
  signIn: "/users/signin",

  /**
   * GET /users/me
   */
  me: "/users/me",

  /** POST /users/signout */
  signOut: "/users/signout",
};
