import { createZodDto } from '@anatine/zod-nestjs'
import { generateSchema } from '@anatine/zod-openapi'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  UsePipes,
} from '@nestjs/common'
import { z, ZodError } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe'

import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { InvalidDocumentError } from '@/core/errors/invalid-document'
import { ResponsibleNotFoundError } from '@/domain/manager/application/use-cases/responsible/errors/responsible-not-found'
import { ChangePasswordResponsibleUseCase } from '@/domain/manager/application/use-cases/responsible/change-password-responsible'
import { PasswordAreSameError } from '@/core/errors/errors/password-are-same-error'

const changePasswordResponsibleParamsSchema = z.object({
  responsibleId: z.string(),
})

const changePasswordResponsibleBodySchema = z.object({
  password: z.string().min(6).max(12),
})

class EditResponsibleParamDto extends createZodDto(
  changePasswordResponsibleParamsSchema,
) {}
class EditResponsibleDto extends createZodDto(
  changePasswordResponsibleBodySchema,
) {}

@ApiTags('responsibles')
@Controller('/responsibles/:responsibleId')
export class ChangePasswordResponsibleController {
  constructor(
    private changePasswordResponsibleUseCase: ChangePasswordResponsibleUseCase,
  ) {}

  @Patch()
  @HttpCode(200)
  @UsePipes(
    new ZodValidationPipe({
      param: changePasswordResponsibleParamsSchema,
      body: changePasswordResponsibleBodySchema,
    }),
  )
  @ApiOperation({ summary: 'Change password of the a responsible' })
  @ApiBody({ type: EditResponsibleParamDto })
  @ApiBody({ type: EditResponsibleDto })
  @ApiResponse({ status: 200, description: 'Responsible updated successfully' })
  @ApiResponse({ status: 400, description: 'Document invalid' })
  @ApiResponse({ status: 400, description: 'Invalid type' })
  @ApiResponse({ status: 409, description: 'Password  are the same' })
  @ApiResponse({ status: 404, description: 'Responsible not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async handle(
    @Param() { responsibleId }: EditResponsibleParamDto,
    @Body() body: EditResponsibleDto,
  ) {
    const { password } = body

    const result = await this.changePasswordResponsibleUseCase.execute({
      id: responsibleId,
      password,
    })

    if (result.isLeft()) {
      switch (result.value.constructor) {
        case InvalidDocumentError:
          throw new BadRequestException('Invalid document')
        case ZodError:
          throw new BadRequestException(
            `Validation fields. Error: ${result.value}`,
          )
        case PasswordAreSameError:
          throw new ConflictException('Password are the same')
        case ResponsibleNotFoundError:
          throw new NotFoundException('Responsible not found')
        default:
          throw new InternalServerErrorException()
      }
    }
  }
}

export const ChangePasswordResponsibleBodySchema = generateSchema(
  changePasswordResponsibleBodySchema,
)
export const ChangePasswordResponsibleParamSchema = generateSchema(
  changePasswordResponsibleParamsSchema,
)
