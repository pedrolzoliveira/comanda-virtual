import { prismaClient } from '@/config/prisma/client'
import { HttpError } from '@/http/errors/http-error'
import { HttpStatusCode } from '@/http/http-status-code'
import { schemaValidator } from '@/http/middlawares/schema-validator'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library'
import { type Request, type Response } from 'express'
import { ComandaNotFound } from './errors/comanda-not-found'
import { addCharge } from './use-cases/add-charge'
import { addPayment } from './use-cases/add-payment'
import { createComanda } from './use-cases/create-comanda'
import { addAdjustment } from './use-cases/add-adjustment'
import { updateComanda } from './use-cases/update-comanda'

interface GetRequest extends Request {
  data: {
    id?: string | string[]
    transactions?: boolean
  }
}

export const comandasController = {
  get: [
    schemaValidator({
      id: {
        in: 'query',
        isUUID: true,
        optional: true
      },
      'id.*': {
        in: 'query',
        isUUID: true,
        optional: true
      },
      transactions: {
        in: 'query',
        isBoolean: true,
        toBoolean: true,
        optional: true
      }
    }),
    async (req: GetRequest, res: Response) => {
      const { id, transactions } = req.data

      switch (typeof id) {
        case 'string': {
          const comanda = await prismaClient.comanda.findUnique({
            where: { id },
            include: {
              transactions: !transactions
                ? false
                : {
                    orderBy: {
                      createdAt: 'desc'
                    }
                  }
            }
          })

          if (!comanda) {
            throw new HttpError('NOT_FOUND', 'Comanda not found')
          }

          return res.status(HttpStatusCode.OK).send(comanda)
        }
        case 'object': {
          const comandas = await prismaClient.comanda.findMany({
            where: { id: { in: id } },
            include: { transactions: Boolean(transactions) }
          })

          return res.status(HttpStatusCode.OK).send(comandas)
        }

        default: {
          const comandas = await prismaClient.comanda.findMany({ include: { transactions: Boolean(transactions) } })

          return res.status(HttpStatusCode.OK).send(comandas)
        }
      }
    }
  ],
  create: [
    schemaValidator({
      name: {
        isString: true
      },
      cellphone: {
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
          throw new HttpError('CONFLICT', 'Cellphone already taken')
        }
        throw new HttpError('INTERNAL_SERVER_ERROR')
      }
    }
  ],
  update: [
    schemaValidator({
      id: {
        isUUID: true
      },
      name: {
        isString: true
      },
      cellphone: {
        isString: true
      }
    }),
    async (req: Request, res: Response) => {
      try {
        const comanda = await updateComanda(req.data)
        return res.status(HttpStatusCode.OK).send(comanda)
      } catch (error) {
        console.log(error)
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
          throw new HttpError('CONFLICT', 'Cellphone already taken')
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
  ],
  addAdjustment: [
    schemaValidator({
      comandaId: {
        isUUID: true
      },
      value: {
        isInt: true
      }
    }),
    async (req: Request, res: Response) => {
      try {
        const adjustment = await addAdjustment(req.data)
        return res.status(HttpStatusCode.CREATED).send(adjustment)
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
