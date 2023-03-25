import { schemaValidator } from '@/http/middlawares/schema-validator'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { type Request, type Response } from 'express'
import { addCharge } from './use-cases/add-charge'
import { addPayment } from './use-cases/add-payment'
import { createComanda } from './use-cases/create-comanda'
import { getComanda } from './use-cases/get-comanda'

export const comandasController = {
  get: [
    schemaValidator({
      id: {
        in: 'query',
        isUUID: true
      },
      transactions: {
        in: 'query',
        isBoolean: true,
        optional: true
      }
    }),
    async (req: Request, res: Response) => {
      const comanda = await getComanda(req.data.id, { transactions: req.data.transactions })
      return res.status(200).send(comanda)
    }
  ],
  create: [
    schemaValidator({
      name: {
        isString: true
      },
      cellPhone: {
        isString: true
      }
    }),
    async (req: Request, res: Response) => {
      const comanda = await createComanda(req.data)
      return res.status(201).send(comanda)
    }
  ],
  addCharge: [
    schemaValidator({
      comandaId: {
        isUUID: true
      },
      description: {
        isString: true
      },
      value: {
        isInt: true
      }
    }),
    async (req: Request, res: Response) => {
      try {
        const charge = await addCharge(req.data)
        return res.status(201).send(charge)
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
          return res.sendStatus(404)
        }

        return res.sendStatus(500)
      }
    }
  ],
  addPayment: [
    schemaValidator({
      comandaId: {
        isUUID: true
      },
      description: {
        isString: true
      },
      value: {
        isInt: true
      }
    }),
    async (req: Request, res: Response) => {
      try {
        const charge = await addPayment(req.data)
        return res.status(201).send(charge)
      } catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
          return res.sendStatus(404)
        }

        return res.sendStatus(500)
      }
    }
  ]
} as const
