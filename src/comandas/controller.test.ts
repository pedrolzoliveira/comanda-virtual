import { server } from '@/http/server'
import { factory } from '@/utils/test/factory'
import { faker } from '@faker-js/faker'
import { type Transaction, type Comanda } from '@prisma/client'
import request, { type Response } from 'supertest'

describe('comandasController', () => {
  let response: Response
  describe('GET /comandas', () => {
    const makeRequest = async (data: any) => await request(server).get('/comandas').query(data)

    describe('2XX', () => {
      describe('gets the comanda', () => {
        let COMANDA: Comanda
        beforeAll(async () => {
          COMANDA = await factory.createComanda()
          response = await makeRequest({ id: COMANDA.id })
        })

        it('returns 200', () => {
          expect(response.statusCode).toBe(200)
        })

        it('returns the right body', () => {
          expect(response.body).toEqual({ ...COMANDA, createdAt: expect.any(String) })
        })
      })

      describe('gets the comanda with transactions', () => {
        let COMANDA: Comanda
        let TRANSACTIONS: Transaction[]

        beforeAll(async () => {
          COMANDA = await factory.createComanda()
          TRANSACTIONS = await Promise.all(Array(1).fill(null).map(async () => await factory.createTransaction({ comandaId: COMANDA.id })))
          response = await makeRequest({ id: COMANDA.id, transactions: true })
        })

        it('returns 200', () => {
          expect(response.statusCode).toBe(200)
        })

        it('returns the right body', () => {
          expect(response.body).toEqual({
            ...COMANDA,
            createdAt: expect.any(String),
            // TODO
            // Use something order than arrayContaining
            // https://github.com/jest-community/jest-extended/blob/main/src/matchers/toIncludeAllMembers.js
            // https://github.com/jest-community/jest-extended/issues/114
            transactions: expect.arrayContaining(TRANSACTIONS.map(transaction => ({ ...transaction, createdAt: expect.any(String) })))
          })
        })
      })
    })

    describe('4XX', () => {
      describe('tries to make a request with transactions flag not being a boolean', () => {
        beforeAll(async () => {
          response = await makeRequest({ id: faker.datatype.uuid(), transactions: faker.random.word() })
        })

        it('returns 400', () => {
          expect(response.statusCode).toBe(400)
        })
      })
      describe('tries to make a request with a random word as id', () => {
        beforeAll(async () => {
          response = await makeRequest({ id: faker.random.word() })
        })

        it('returns 400', () => {
          expect(response.statusCode).toBe(400)
        })
      })
    })
  })
  describe('POST /comandas', () => {
    const makeRequest = async (data: any) => await request(server).post('/comandas').send(data)

    describe('2XX', () => {
      const COMANDA_DATA = {
        name: faker.name.fullName(),
        cellPhone: faker.phone.number()
      }

      describe('creates a comanda', () => {
        beforeAll(async () => {
          response = await makeRequest(COMANDA_DATA)
        })

        it('returns 201', () => {
          expect(response.statusCode).toBe(201)
        })

        it('returns the right body', () => {
          expect(response.body).toEqual({
            id: expect.any(String),
            name: COMANDA_DATA.name,
            cellPhone: COMANDA_DATA.cellPhone,
            amount: 0,
            createdAt: expect.any(String)
          })
        })
      })
    })
    describe('4XX', () => {
      describe('tries to create a request withou name', () => {
        beforeAll(async () => {
          response = await makeRequest({ cellPhone: faker.phone.number() })
        })

        it('returns 400', () => {
          expect(response.statusCode).toBe(400)
        })
      })
      describe('tries to create a request without a cellPhone', () => {
        beforeAll(async () => {
          response = await makeRequest({ name: faker.name.fullName() })
        })

        it('returns 400', () => {
          expect(response.statusCode).toBe(400)
        })
      })
      describe('tries to create a comanda with a callPhone already taken', () => {
        beforeAll(async () => {
          const cellPhone = '13999999999'
          await factory.createComanda({ cellPhone })
          response = await makeRequest({ name: faker.name.fullName(), cellPhone })
        })

        it('rerturns 409', () => {
          expect(response.statusCode).toBe(409)
        })
      })
    })
  })
  describe('POST /comandas/charges', () => {
    const makeRequest = async (data: any) => await request(server).post('/comandas/charges').send(data)

    const createValidBody = (data: { comandaId?: string, description?: string, value?: number } = {}) => ({
      comandaId: data.comandaId ?? faker.datatype.uuid(),
      description: data.description ?? faker.random.words(3),
      value: data.value ?? faker.datatype.number({ min: 100, max: 2500 })
    })

    describe('2XX', () => {
      describe('creates a charge', () => {
        let CHARGE_DATA: ReturnType<typeof createValidBody>
        beforeAll(async () => {
          const { id: comandaId } = await factory.createComanda()
          CHARGE_DATA = createValidBody({ comandaId })
          response = await makeRequest(CHARGE_DATA)
        })

        it('returns the right body', () => {
          expect(response.body).toEqual({
            id: expect.any(String),
            comandaId: CHARGE_DATA.comandaId,
            type: 'charge',
            description: CHARGE_DATA.description,
            amount: CHARGE_DATA.value,
            createdAt: expect.any(String)
          })
        })

        it('returns 201', () => {
          expect(response.statusCode).toBe(201)
        })
      })
    })

    describe('4XX', () => {
      describe('tries to create a charge without comandaId', () => {
        beforeAll(async () => {
          response = await makeRequest({
            ...createValidBody(),
            comandaId: undefined
          })
        })

        it('returns 400', () => {
          expect(response.statusCode).toBe(400)
        })
      })

      describe('tries to create a charge without description', () => {
        beforeAll(async () => {
          response = await makeRequest({
            ...createValidBody(),
            description: undefined
          })
        })

        it('returns 400', () => {
          expect(response.statusCode).toBe(400)
        })
      })

      describe('tries to create a charge without value', () => {
        beforeAll(async () => {
          response = await makeRequest({
            ...createValidBody(),
            value: undefined
          })
        })

        it('returns 400', () => {
          expect(response.statusCode).toBe(400)
        })
      })

      describe('tries to create a charge with comandaId as random word', () => {
        beforeAll(async () => {
          response = await makeRequest(createValidBody({ comandaId: faker.random.word() }))
        })

        it('returns 400', () => {
          expect(response.statusCode).toBe(400)
        })
      })

      describe('tries to create a charge with an inexisting comanda', () => {
        beforeAll(async () => {
          response = await makeRequest(createValidBody())
        })

        it('returns 404', () => {
          expect(response.statusCode).toBe(404)
        })
      })
    })
  })
  describe('POST /comandas/payments', () => {
    const makeRequest = async (data: any) => await request(server).post('/comandas/payments').send(data)

    const createValidBody = (data: { comandaId?: string, description?: string, value?: number } = {}) => ({
      comandaId: data.comandaId ?? faker.datatype.uuid(),
      description: data.description ?? faker.random.words(3),
      value: data.value ?? faker.datatype.number({ min: 100, max: 2500 })
    })

    describe('2XX', () => {
      describe('creates a charge', () => {
        let CHARGE_DATA: ReturnType<typeof createValidBody>
        beforeAll(async () => {
          const { id: comandaId } = await factory.createComanda()
          CHARGE_DATA = createValidBody({ comandaId })
          response = await makeRequest(CHARGE_DATA)
        })

        it('returns the right body', () => {
          expect(response.body).toEqual({
            id: expect.any(String),
            comandaId: CHARGE_DATA.comandaId,
            type: 'payment',
            description: CHARGE_DATA.description,
            amount: CHARGE_DATA.value,
            createdAt: expect.any(String)
          })
        })

        it('returns 201', () => {
          expect(response.statusCode).toBe(201)
        })
      })
    })

    describe('4XX', () => {
      describe('tries to create a charge without comandaId', () => {
        beforeAll(async () => {
          response = await makeRequest({
            ...createValidBody(),
            comandaId: undefined
          })
        })

        it('returns 400', () => {
          expect(response.statusCode).toBe(400)
        })
      })

      describe('tries to create a charge without description', () => {
        beforeAll(async () => {
          response = await makeRequest({
            ...createValidBody(),
            description: undefined
          })
        })

        it('returns 400', () => {
          expect(response.statusCode).toBe(400)
        })
      })

      describe('tries to create a charge without value', () => {
        beforeAll(async () => {
          response = await makeRequest({
            ...createValidBody(),
            value: undefined
          })
        })

        it('returns 400', () => {
          expect(response.statusCode).toBe(400)
        })
      })

      describe('tries to create a charge with comandaId as random word', () => {
        beforeAll(async () => {
          response = await makeRequest(createValidBody({ comandaId: faker.random.word() }))
        })

        it('returns 400', () => {
          expect(response.statusCode).toBe(400)
        })
      })

      describe('tries to create a charge with an inexisting comanda', () => {
        beforeAll(async () => {
          response = await makeRequest(createValidBody())
        })

        it('returns 404', () => {
          expect(response.statusCode).toBe(404)
        })
      })
    })
  })
})
