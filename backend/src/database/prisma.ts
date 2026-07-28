import { PrismaClient } from '@prisma/client';

// Cliente único para comunicar com a base de dados através do Prisma.
export const prisma = new PrismaClient();
