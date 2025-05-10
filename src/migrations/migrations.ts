import { Migration } from "./migrationTypes";

/* eslint-disable @typescript-eslint/no-require-imports */
export const migrations: Migration[] = [
].sort((a: Migration, b: Migration) => a.version.localeCompare(b.version));
/* eslint-enable @typescript-eslint/no-require-imports */