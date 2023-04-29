import { type Comanda } from '@prisma/client'
import { adjustAmount } from './adjust-amount'
import { factory } from '@/utils/test/factory'
import { prismaClient } from '@/config/prisma/client'

describe('AdjustAmount', () => {
  let comanda: Comanda

  const INITIAL_AMOUNT = 1250
  const AMOUNT = 250

  beforeAll(async () => {
    comanda = await factory.createComanda({ amount: INITIAL_AMOUNT })
    await adjustAmount({ id: comanda.id, amount: AMOUNT })
  })

  it('adjusts the value in the comanda', async () => {
    await expect(
      prismaClient.comanda.findUnique({ where: { id: comanda.id } })
    ).resolves.toEqual({
      id: comanda.id,
      amount: AMOUNT,
      cellphone: expect.any(String),
      name: expect.any(String),
      createdAt: expect.any(Date)
    })
  })

  it('creates a transaction', async () => {
    await expect(
      prismaClient.transaction.findFirst({ where: { comandaId: comanda.id } })
    ).resolves.toEqual({
      id: expect.any(String),
      comandaId: comanda.id,
      type: 'adjustment',
      description: 'Ajuste',
      createdAt: expect.any(Date),
      amount: AMOUNT - INITIAL_AMOUNT
    })
  })
})
