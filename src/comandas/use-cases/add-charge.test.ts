import { factory } from '@/utils/test/factory'
import { faker } from '@faker-js/faker'
import { addCharge } from './add-charge'

describe('addCharge', () => {
  let comandaId: string
  beforeAll(async () => {
    ({ id: comandaId } = await factory.createComanda())
  })

  describe('adds charge to comanda', () => {
    it('creates a transaction of type charge', async () => {
      const CHARGE_DATA = {
        comandaId,
        description: faker.random.words(5),
        value: 1000
      }
      await expect(
        addCharge(CHARGE_DATA)
      ).resolves.toEqual({
        id: expect.any(String),
        comandaId,
        description: CHARGE_DATA.description,
        amount: CHARGE_DATA.value,
        type: 'charge'
      })
    })
  })
})
