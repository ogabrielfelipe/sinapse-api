import { createZodDto } from '@anatine/zod-nestjs'
import { generateSchema } from '@anatine/zod-openapi'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  UsePipes,
} from '@nestjs/common'
import { z, ZodError } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe'

import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ResponsibleNotFoundError } from '@/domain/manager/application/use-cases/responsible/errors/responsible-not-found'
import { DeleteResponsibleUseCase } from '@/domain/manager/application/use-cases/responsible/delete-responsible'

const deleteResponsibleParamsSchema = z.object({
  responsibleId: z.string(),
})

class DeleteResponsibleParamDto extends createZodDto(
  deleteResponsibleParamsSchema,
) {}

@ApiTags('responsibles')
@Controller('/responsibles/:responsibleId')
export class DeleteResponsibleController {
  constructor(private deleteResponsibleUseCase: DeleteResponsibleUseCase) {}

  @Delete()
  @HttpCode(200)
  @UsePipes(
    new ZodValidationPipe({
      param: deleteResponsibleParamsSchema,
    }),
  )
  @ApiOperation({ summary: 'Delete a responsible' })
  @ApiBody({ type: DeleteResponsibleParamDto })
  @ApiResponse({ status: 200, description: 'Responsible deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid type' })
  @ApiResponse({ status: 404, description: 'Responsible not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async handle(@Param() { responsibleId }: DeleteResponsibleParamDto) {
    const result = await this.deleteResponsibleUseCase.execute({
      id: responsibleId,
    })

    if (result.isLeft()) {
      switch (result.value.constructor) {
        case ZodError:
          throw new BadRequestException(
            `Validation fields. Error: ${result.value}`,
          )
        case ResponsibleNotFoundError:
          throw new NotFoundException('Responsible not found')
        default:
          throw new InternalServerErrorException()
      }
    }
  }
}

export const DeleteResponsibleBodySchema = generateSchema(
  deleteResponsibleParamsSchema,
)
