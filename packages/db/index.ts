// Generate a new prisma client: bun prisma generate
// Run the migrations: bun prisma migrate dev
// Run the seed: bun prisma db seed

//Steps:
// 1. Create the DB schemas in the prisma/schema.prisma file
// 2. Run the migrations: bun prisma migrate dev
// 3. Generate the Prisma client: bun prisma generate
// 4. Use the Prisma client in the app: import { PrismaClient } from "@prisma/client";

//Now we have a DB package which is exporting everything in index.ts file which is PrismaClient
//The exporting in mentioned in package.json file just like common package for types

import { PrismaClient } from "@prisma/client";

export const prismaClient = new PrismaClient();
