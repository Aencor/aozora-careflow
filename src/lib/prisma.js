import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

let prisma;

const dbPath = process.env.DATABASE_PATH 
  ? path.resolve(process.env.DATABASE_PATH)
  : path.resolve(process.cwd(), 'dev.db');

const adapter = new PrismaBetterSqlite3({
  url: `file:${dbPath}`,
});

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter });
} else {
  // Prevent multiple instances of Prisma Client in development (Hot Reloading)
  if (!global.prisma) {
    global.prisma = new PrismaClient({ adapter });
  }
  prisma = global.prisma;
}

export default prisma;
