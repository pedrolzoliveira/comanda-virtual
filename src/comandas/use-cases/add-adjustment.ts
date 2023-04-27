import { prismaClient } from '@/config/prisma/client'
import { ComandaNotFound } from '../errors/comanda-not-found'

interface AddAdjustmentData {
  comandaId: string
  value: number
}

export const addAdjustment = async ({ comandaId, value }: AddAdjustmentData) => {
  return await prismaClient.$transaction(async tx => {
    const comanda = await tx.comanda.findUnique({ where: { id: comandaId } })
    if (!comanda) throw new ComandaNotFound()

    await tx.comanda.update({
      data: { amount: comanda.amount - value },
      where: { id: comandaId }
    })

    return await tx.transaction.create({
      data: {
        amount: value,
        description: 'Ajuste',
        type: 'adjustment',
        comanda: {
          connect: {
            id: comandaId
          }
        }
      }
    })
  })
}
