import { prismaClient } from '@/config/prisma/client'

interface AddPaymentParams {
  comandaId: string
  description: string
  value: number
}

export const addPayment = async (data: AddPaymentParams) => {
  return await prismaClient.transaction.create({
    data: {
      amount: data.value,
      description: data.description,
      type: 'payment',
      comanda: {
        connect: {
          id: data.comandaId
        }
      }
    }
  })
}
