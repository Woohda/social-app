import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

/**
 * Эта функция создает экземпляр PrismaClient с расширением Accelerate.
 * Она использует глобальную переменную для хранения экземпляра,
 * чтобы избежать создания нескольких экземпляров в среде разработки.
 * В производственной среде создается новый экземпляр.
 * @property {PrismaClient} prisma - экземпляр PrismaClient
 * @property {globalForPrisma} globalForPrisma - глобальная переменная для хранения экземпляра PrismaClient
 */

const globalForPrisma = global as unknown as {
	prisma: PrismaClient
}

const prisma =
	globalForPrisma.prisma || new PrismaClient().$extends(withAccelerate())

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
