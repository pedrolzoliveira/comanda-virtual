import { type Comanda, type Transaction } from '@prisma/client'
import { addAdjustment } from './add-adjustment'
import { factory } from '@/utils/test/factory'
import { prismaClient } from '@/config/prisma/client'

describe('addAdjustment', () => {
  let comanda: Comanda
  let transaction: Transaction

  beforeAll(async () => {
    comanda = await factory.createComanda({ amount: 1000 })

    transaction = await addAdjustment({ comandaId: comanda.id, value: -250 })
  })

  it('adjusts the value in the comanda', async () => {
    expect(
      prismaClient.comanda.findUnique({ where: { id: comanda.id } })
    ).resolves.toEqual({
      id: expect.any(String),
      name: expect.any(String),
      cellphone: expect.any(String),
      amount: 750,
      createdAt: expect.any(Date)
    })
  })

  it('creates a transaction', () => {
    expect(transaction).toEqual({
      id: expect.any(String),
      comandaId: comanda.id,
      description: 'Ajuste',
      amount: -250,
      type: 'adjustment',
      createdAt: expect.any(Date)
    })
  })
})
