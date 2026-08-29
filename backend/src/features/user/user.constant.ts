// user constant
export const USER_CONSTANTS = {
  /** longest accepted username */
  USERNAME_MAX_LENGTH: 30,
  /** longest accepted display name */
  NAME_MAX_LENGTH: 60,
  /** rendered as @username, so keep it to handle-safe characters */
  USERNAME_PATTERN: /^[a-zA-Z0-9._-]+$/,
} as const;

/** Cookie the browser's identity rides in — httpOnly, so client JS can't read or forge it */
export const USER_COOKIE = {
  NAME: "sneaker_user",
  /** identity should outlive a demo session but not linger forever */
  MAX_AGE_MS: 7 * 24 * 60 * 60 * 1000,
} as const;
