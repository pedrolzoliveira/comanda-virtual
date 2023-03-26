import { type Request, type Response, type NextFunction } from 'express'
import { HttpError } from '../errors/http-error'

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof HttpError) {
    return res.status(error.statusCode).send(error)
  }
  return res.status(500).send(error)
}
