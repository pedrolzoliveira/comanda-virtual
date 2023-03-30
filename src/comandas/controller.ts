import { HttpError } from '@/http/errors/http-error'
import { HttpStatusCode } from '@/http/http-status-code'
import { schemaValidator } from '@/http/middlawares/schema-validator'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { type Request, type Response } from 'express'
import { ComandaNotFound } from './errors/comanda-not-found'
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
        toBoolean: true,
        optional: true
      }
    }),
    async (req: Request, res: Response) => {
      const comanda = await getComanda(req.data.id, { transactions: req.data.transactions })
      return res.status(HttpStatusCode.OK).send(comanda)
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
      try {
        const comanda = await createComanda(req.data)
        return res.status(HttpStatusCode.CREATED).send(comanda)
      } catch (error) {
        console.log(error)
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
          throw new HttpError('CONFLICT', 'CellPhone already taken')
        }
        throw new HttpError('INTERNAL_SERVER_ERROR')
      }
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
        return res.status(HttpStatusCode.CREATED).send(charge)
      } catch (error) {
        if (error instanceof ComandaNotFound) {
          throw new HttpError(
            'NOT_FOUND',
            'Comanda not found'
          )
        }
        throw new HttpError('INTERNAL_SERVER_ERROR')
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
        return res.status(HttpStatusCode.CREATED).send(charge)
      } catch (error) {
        if (error instanceof ComandaNotFound) {
          throw new HttpError(
            'NOT_FOUND',
            'Comanda not found'
          )
        }
        throw new HttpError('INTERNAL_SERVER_ERROR')
      }
    }
  ]
} as const
