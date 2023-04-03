/**
 * The snap origin to use.
 * Will default to the local hosted snap if no value is provided in environment.
 */
console.log(process.env.SNAP_ORIGIN);
export const defaultSnapOrigin = process.env.SNAP_ORIGIN
  ? process.env.SNAP_ORIGIN
  : `local:http://localhost:8080`;
