import 'dotenv/config'

const createEnv = () => {
  return { PORT: Number(process.env.PORT ?? 3030) } as const
}

export const env = createEnv()
