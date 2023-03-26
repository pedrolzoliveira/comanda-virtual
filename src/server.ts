import { env } from '@/config/env'
import { server } from './http/server'

const { PORT } = env

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
