import { prismaClient } from '@/config/prisma/client'

interface AddPaymentParams {
  comandaId: string
  description: string
  value: number
}

export const addPayment = async (data: AddPaymentParams) => {
  return await prismaClient.$transaction(async tx => {
    const comanda = await tx.comanda.findUnique({ where: { id: data.comandaId } })
    if (!comanda) throw new Error('Comanda not found')

    await tx.comanda.update({ data: { amount: comanda.amount - data.value }, where: { id: data.comandaId } })

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
  })
}
