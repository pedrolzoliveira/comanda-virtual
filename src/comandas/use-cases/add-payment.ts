import { prismaClient } from '@/config/prisma/client'
import { ComandaNotFound } from '../errors/comanda-not-found'

interface AddPaymentParams {
  comandaId: string
  description: string
  value: number
}

export const addPayment = async (data: AddPaymentParams) => {
  return await prismaClient.$transaction(async tx => {
    const comanda = await tx.comanda.findUnique({ where: { id: data.comandaId } })
    if (!comanda) throw new ComandaNotFound()

    await tx.comanda.update({ data: { amount: comanda.amount - data.value }, where: { id: data.comandaId } })

    return await tx.transaction.create({
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
