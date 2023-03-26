import 'dotenv/config'

class MissingEnv extends Error {
  constructor(variable: string) {
    super(`missing env var ${variable}`)
  }
}

const createEnv = () => {
  const CORS_ORIGIN = process.env.CORS_ORIGIN
  if (!CORS_ORIGIN) {
    throw new MissingEnv('CORS_ORIGIN')
  }
  return {
    PORT: Number(process.env.PORT ?? 3030),
    CORS_ORIGIN
  } as const
}

export const env = createEnv()
