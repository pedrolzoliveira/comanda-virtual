import { prismaClient } from '@/config/prisma/client'

interface CreateComandaParams {
  name: string
  cellphone: string
}

export const createComanda = async ({ name, cellphone }: CreateComandaParams) => {
  return await prismaClient.comanda.create({
    data: {
      name,
      cellphone,
      amount: 0
    }
  })
}
