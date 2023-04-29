import { prismaClient } from '@/config/prisma/client'
import { ComandaNotFound } from '../errors/comanda-not-found'

interface AdjustAmountData {
  id: string
  amount: number
}

export const adjustAmount = async ({ id, amount }: AdjustAmountData) => {
  return await prismaClient.$transaction(async tx => {
    const comanda = await tx.comanda.findUnique({ where: { id } })
    if (!comanda) throw new ComandaNotFound()

    await tx.transaction.create({
      data: {
        amount: amount - comanda.amount,
        description: 'Ajuste',
        type: 'adjustment',
        comanda: { connect: { id } }
      }
    })

    return await tx.comanda.update({
      data: { amount },
      where: { id }
    })
  })
}
