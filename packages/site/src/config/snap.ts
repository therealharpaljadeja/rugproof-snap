/**
 * The snap origin to use.
 * Will default to the local hosted snap if no value is provided in environment.
 */
export const defaultSnapOrigin =
  process.env.GATSBY_VERCEL_ENV === 'production'
    ? 'npm:rugproof-snap'
    : `local:http://localhost:8080`;
