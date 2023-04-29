import { prismaClient } from '@/config/prisma/client'

interface UpdateComandaData {
  id: string
  name: string
  cellphone: string
}

export const updateComanda = async ({ id, name, cellphone }: UpdateComandaData) => {
  return await prismaClient.comanda.update({
    data: { name, cellphone },
    where: { id }
  })
}
