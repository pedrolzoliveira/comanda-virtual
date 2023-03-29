import { prismaClient } from '@/config/prisma/client'
import { ComandaNotFound } from '../errors/comanda-not-found'

interface AddChargeParams {
  comandaId: string
  description: string
  value: number
}

export const addCharge = async (data: AddChargeParams) => {
  return await prismaClient.$transaction(async tx => {
    const comanda = await tx.comanda.findUnique({ select: { amount: true }, where: { id: data.comandaId } })
    if (!comanda) throw new ComandaNotFound()

    await tx.comanda.update({ data: { amount: comanda.amount + data.value }, where: { id: data.comandaId } })

    return await tx.transaction.create({
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
  })
}
