import { factory } from '@/utils/test/factory'
import { getComanda } from './get-comanda'

describe('getComanda', () => {
  let COMANDA_DATA: Awaited<ReturnType<typeof factory.createComanda>>
  let TRANSACTIONS: Array<Awaited<ReturnType<typeof factory.createTransaction>>>
  beforeAll(async () => {
    COMANDA_DATA = await factory.createComanda()
    TRANSACTIONS = await Promise.all(new Array(2).fill(null).map(async () => await factory.createTransaction({ comandaId: COMANDA_DATA.id })))
  })

  describe('gets a comanda', () => {
    it('returns the comanda', () => {
      expect(getComanda(COMANDA_DATA.id)).resolves.toEqual(COMANDA_DATA)
    })
  })
  describe('gets the comanda with transactions', () => {
    it('returns the comanda with transactions', () => {
      expect(
        getComanda(COMANDA_DATA.id, {
          transactions: true
        })
      ).resolves.toEqual({
        ...COMANDA_DATA,
        transactions: TRANSACTIONS
      })
    })
  })
})
