import {
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common'

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { IdentifyUseCase } from '@/core/application/authentication/identify'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

@ApiTags('session')
@Controller('/auth/identify')
export class IdentifyController {
  constructor(private identify: IdentifyUseCase) {}

  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: 'Identifies a user by token' })
  @ApiResponse({
    status: 200,
    description: 'User Authenticated successfully',
    example: {
      user: {
        id: 'cxcnuu0z4mqndfnuj2g4h4jr',
        name: 'Cedric Gulgowski V',
        email: 'john.doe@mail.com',
        roles: ['RESPONSIBLE'],
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Invalid Fields.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async handle(@CurrentUser() user: UserPayload) {
    console.log(user, user.sub)

    const result = await this.identify.execute({
      id: user.sub,
    })

    if (result.isLeft()) {
      switch (result.value.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException('User not found')
        default:
          throw new InternalServerErrorException()
      }
    }

    return {
      user: result.value,
    }
  }
}
