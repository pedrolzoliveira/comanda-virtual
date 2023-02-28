import { prismaClient } from '@/config/prisma/client'

interface CreateComandaParams {
  name: string
  cellPhone: string
}

export const createComanda = async ({ name, cellPhone }: CreateComandaParams) => {
  return await prismaClient.comanda.create({
    data: {
      name,
      cellPhone,
      amount: 0
    }
  })
}
