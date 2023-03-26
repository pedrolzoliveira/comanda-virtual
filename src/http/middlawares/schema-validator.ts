import { type NextFunction, type Request, type Response } from 'express'
import { checkSchema, matchedData, type Schema } from 'express-validator'
import { BadRequestError } from '../errors/bad-request-error'

export const schemaValidator = (schema: Schema) => {
  return async(req: Request, res: Response, next: NextFunction) => {
    const resultArr = await checkSchema(schema).run(req)
    const errors = resultArr.map(result => result.array().pop()).filter(Boolean)
    if (errors.length) {
      throw new BadRequestError(
        `Invalid fields [${errors.map(err => err.param).join(', ')}]`,
        { errors, schema }
      )
    } else {
      req.data = matchedData(req)
      next()
    }
  }
}
