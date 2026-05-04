import { getPayload as getPayloadCore } from 'payload'
import config from '@payload-config'

let cached: ReturnType<typeof getPayloadCore> | null = null

export const getPayload = () => {
  if (!cached) cached = getPayloadCore({ config })
  return cached
}
