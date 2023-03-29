import { prismaClient } from '@/config/prisma/client'
import { factory } from '@/utils/test/factory'
import { faker } from '@faker-js/faker'
import { type Comanda, type Transaction } from '@prisma/client'
import { addPayment } from './add-payment'

describe('addPayment', () => {
  let comandaId: string
  beforeAll(async () => {
    ({ id: comandaId } = await factory.createComanda({ amount: 1500 }))
  })

  describe('adds payment to comanda', () => {
    let comanda: Comanda
    let payment: Transaction

    const PAYMENT_DATA = {
      description: faker.random.words(5),
      value: 1000
    }

    beforeAll(async () => {
      payment = await addPayment({ ...PAYMENT_DATA, comandaId })
      comanda = await prismaClient.comanda.findUnique({ where: { id: comandaId } }) as Comanda
    })

    it('creates a transaction of type payment', () => {
      expect(payment).toEqual({
        id: expect.any(String),
        comandaId,
        description: PAYMENT_DATA.description,
        amount: PAYMENT_DATA.value,
        type: 'payment',
        createdAt: expect.any(Date)
      })
    })

    it('removes it values from the comanda', () => {
      expect(comanda.amount).toBe(500)
    })
  })
})
