import { HttpStatusCode } from '../http-status-code'

export class HttpError extends Error {
  public meta?: any
  public statusCode: number
  public errorMessage: string

  constructor(
    public readonly status: keyof typeof HttpStatusCode,
    message?: string
  ) {
    super(message ?? status)
    this.errorMessage = this.message
    this.statusCode = HttpStatusCode[status]
  }
}
