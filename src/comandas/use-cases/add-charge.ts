import { prismaClient } from '@/config/prisma/client'

interface AddChargeParams {
  comandaId: string
  description: string
  value: number
}

export const addCharge = async (data: AddChargeParams) => {
  return await prismaClient.transaction.create({
    data: {
      amount: data.value,
      description: data.description,
      type: 'charge',
      comanda: {
        connect: {
          id: data.comandaId
        }
      }
    }
  })
}
