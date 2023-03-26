import { HttpError } from './http-error'

export class BadRequestError extends HttpError {
  constructor(message: string, public meta: any) {
    super('BAD_REQUEST', message)
  }
}
