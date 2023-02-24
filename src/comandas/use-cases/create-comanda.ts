import { PrismaClient } from '@prisma/client'

interface CreateComandaParams {
  name: string
  cellPhone: string
}

export const createComanda = async ({ name, cellPhone }: CreateComandaParams) => {
  const prismaClient = new PrismaClient()
  return await prismaClient.comanda.create({
    data: {
      name,
      cellPhone,
      amount: 0
    }
  })
}
