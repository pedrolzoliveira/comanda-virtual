import { prismaClient } from '@/config/prisma/client'

interface getComandaOptions {
  transactions?: boolean
}

export const getComanda = (id: string, options: getComandaOptions = {}) =>
  prismaClient.comanda.findUnique({
    where: { id },
    include: {
      transactions: options.transactions
        ? {
            orderBy: { createdAt: 'desc' }
          }
        : false
    }
  })
