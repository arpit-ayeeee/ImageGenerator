// After every change in the prisma schema file, run the above command to update the tables in the database: bunx prisma migrate dev
// Update the prisma client every time after any update in the prisma schema file: bunx prisma generate
// DO a global bun install post this, so where ever the package is being used, it'll update the prisma client automatically

import { PrismaClient } from "@prisma/client"

export const prismaClient = new PrismaClient();