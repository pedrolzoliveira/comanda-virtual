import { env } from '@/config/env'
import { server } from './http/server'

server.listen(env.PORT)
