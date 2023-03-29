import { prismaClient } from '@/config/prisma/client'
import { factory } from '@/utils/test/factory'
import { faker } from '@faker-js/faker'
import { type Comanda, type Transaction } from '@prisma/client'
import { addCharge } from './add-charge'

describe('addCharge', () => {
  let comandaId: string
  beforeAll(async () => {
    ({ id: comandaId } = await factory.createComanda())
  })

  describe('adds charge to comanda', () => {
    let comanda: Comanda
    let charge: Transaction

    const CHARGE_DATA = {
      description: faker.random.words(5),
      value: 1000
    }

    beforeAll(async () => {
      charge = await addCharge({ ...CHARGE_DATA, comandaId })
      comanda = await prismaClient.comanda.findUnique({ where: { id: comandaId } }) as Comanda
    })

    it('creates a transaction of type charge', () => {
      expect(charge).toEqual({
        id: expect.any(String),
        comandaId,
        description: CHARGE_DATA.description,
        amount: CHARGE_DATA.value,
        type: 'charge',
        createdAt: expect.any(Date)
      })
    })

    it("increase comanda's values", () => {
      expect(comanda.amount).toBe(1000)
    })
  })
})
