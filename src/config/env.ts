import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.number().default(3030),
  CORS_ORIGIN: z.string().url()
})

export const env = envSchema.parse(process.env)
