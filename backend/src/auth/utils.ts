import { decode } from 'jsonwebtoken'
import { createLogger } from '../utils/logger.js'
import { JwtPayload } from '../lambda/auth/auth0Authorizer'

const logger = createLogger('utils')
/**
 * Parse a JWT token and return a user id
 * @param jwtToken JWT token to parse
 * @returns a user id from the JWT token
 */
export function parseUserId(jwtToken: string | undefined): string {
  const decodedJwt = decode(jwtToken) as JwtPayload
  return decodedJwt.sub
}
