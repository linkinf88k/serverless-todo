import Axios from 'axios'
import jsonwebtoken, { verify } from 'jsonwebtoken'
import { createLogger } from '../../utils/logger.js'
import {
  APIGatewayTokenAuthorizerEvent,
  CustomAuthorizerResult
} from 'aws-lambda'

const logger = createLogger('auth')

const jwksUrl =
  'https://dev-vumnfz4bqser5s55.us.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = await verifyToken(event.authorizationToken)

    return {
      principalId: jwtToken?.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader)
  const jwt = jsonwebtoken.decode(token, { complete: true })

  // TODO: Implement token verification
  const response = await Axios.get(jwksUrl)
  const keys = response.data.keys
  const signingKeys = keys.find((key) => key.kid === jwt.header.kid)
  logger.info('signingKeys', signingKeys)
  if (!signingKeys) {
    throw new Error('Keys is invalid')
  }

  const pemData = signingKeys.x5c[0]
  const secretKey = `-----BEGIN CERTIFICATE-----\n${pemData}\n-----END CERTIFICATE-----\n`
  const verifyToken = verify(token, secretKey, {
    algorithms: ['RS256']
  }) as JwtPayload
  logger.info('verifyToken', verifyToken)
  return verifyToken
}

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}

export interface JwtPayload {
  iss: string
  sub: string
  iat: number
  exp: number
}
