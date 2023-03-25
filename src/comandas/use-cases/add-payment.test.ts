import { factory } from '@/utils/test/factory'
import { faker } from '@faker-js/faker'
import { addPayment } from './add-payment'

describe('addPayment', () => {
  let comandaId: string
  beforeAll(async () => {
    ({ id: comandaId } = await factory.createComanda())
  })

  describe('adds payment to comanda', () => {
    it('creates a transaction of type payment', async () => {
      const PAYMENT_DATA = {
        comandaId,
        description: faker.random.words(5),
        value: 1000
      }
      await expect(
        addPayment(PAYMENT_DATA)
      ).resolves.toEqual({
        id: expect.any(String),
        comandaId,
        description: PAYMENT_DATA.description,
        amount: PAYMENT_DATA.value,
        type: 'payment'
      })
    })
  })
})
