import { createZodDto } from '@anatine/zod-nestjs'
import { generateSchema } from '@anatine/zod-openapi'
import {
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe'

import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { AuthenticateUseCase } from '@/core/application/authentication/authenticate'
import { WrongCredentialsError } from '@/domain/manager/application/use-cases/responsible/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public'

const sessionBodySchema = z.object({
  email: z.string().email().min(1).max(255),
  password: z.string().min(6).max(255),
})

class SessionResponsibleDto extends createZodDto(sessionBodySchema) {}

@ApiTags('session')
@Controller('/auth/session')
@Public()
export class SessionController {
  constructor(private authenticate: AuthenticateUseCase) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe({ body: sessionBodySchema }))
  @ApiOperation({ summary: 'Authentication of the users.' })
  @ApiBody({ type: SessionResponsibleDto })
  @ApiResponse({
    status: 200,
    description: 'User Authenticated successfully',
    example: {
      access_token:
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJyd3dhNTNzbGNvZ3N3ZGphanNjZzdrcm8iLCJyb2xlcyI6WyJSRVNQT05TSUJMRSJdLCJpYXQiOjE3MzI4MDIyNDJ9.c8lDe0fcQZeizhZrWIDIlA5A3RV-i4XtWye85JjfYqS-x1A2bDugXSIAKMtoBto6zCWm_QoDKR_fJGa7PMI0eC1RS2nz3MqLgCVmJ6qd-xuHO-HFOXceLm7IwiOkmjqNvLCf7Q6r-8Azjzn886HiwDr12hDdk5KYnetb_Yhv4B_b2ePu8-4t6I7l_K0dRIiOh9ZcCoLa44pYUKMnII9Qj9xXSJQlSxVzq_K7l3qCc-KLvpVQFC7kTwq8rLXQtNyPWiXov2v1SHuyZRAB6zFOUy-TtXbYylB78ixtNpZkKhMz7ue4_7_LFyVyvCbeOEzCvzKtgXN4yPj6FRZXUbTpyQ',
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid Fields.' })
  @ApiResponse({ status: 401, description: 'Invalid Credentials' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async handle(@Body() body: SessionResponsibleDto) {
    const { email, password } = body

    const result = await this.authenticate.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      switch (result.value.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException('Invalid Credentials')
        default:
          throw new InternalServerErrorException()
      }
    }

    return {
      access_token: result.value.accessToken,
    }
  }
}

export const SessionSchema = generateSchema(sessionBodySchema)
