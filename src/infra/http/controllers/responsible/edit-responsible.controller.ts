import { createZodDto } from '@anatine/zod-nestjs'
import { generateSchema } from '@anatine/zod-openapi'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Put,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe'

import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { InvalidDocumentError } from '@/core/errors/invalid-document'
import { EditResponsibleUseCase } from '@/domain/manager/application/use-cases/responsible/edit-responsible'
import { ResponsibleNotFoundError } from '@/domain/manager/application/use-cases/responsible/errors/responsible-not-found'

const editResponsibleParamsSchema = z.object({
  responsibleId: z.string(),
})

const editResponsibleBodySchema = z.object({
  responsible: z.object({
    name: z.string().min(1).max(255),
    document: z.string().min(1).max(14),
    email: z.string().email().max(255),
    phone: z.string().min(1).max(14),
    isActive: z.boolean({ coerce: true }),
  }),
  address: z.object({
    id: z.string(),
    street: z.string().min(1),
    number: z.string().min(1),
    neighborhood: z.string().min(1),
    complement: z.string().min(1),
    state: z.string().min(1),
    city: z.string().min(1),
  }),
})

class EditResponsibleParamDto extends createZodDto(
  editResponsibleParamsSchema,
) {}
class EditResponsibleDto extends createZodDto(editResponsibleBodySchema) {}

@ApiTags('responsibles')
@Controller('/responsibles/:responsibleId')
export class EditResponsibleController {
  constructor(private editResponsibleUseCase: EditResponsibleUseCase) {}

  @Put()
  @HttpCode(200)
  @UsePipes(
    new ZodValidationPipe({
      param: editResponsibleParamsSchema,
      body: editResponsibleBodySchema,
    }),
  )
  @ApiOperation({ summary: 'Update a responsible' })
  @ApiBody({ type: EditResponsibleParamDto })
  @ApiBody({ type: EditResponsibleDto })
  @ApiResponse({ status: 200, description: 'Responsible updated successfully' })
  @ApiResponse({ status: 400, description: 'Document invalid' })
  @ApiResponse({ status: 400, description: 'Invalid type' })
  @ApiResponse({ status: 404, description: 'Responsible not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async handle(
    @Param() { responsibleId }: EditResponsibleParamDto,
    @Body() body: EditResponsibleDto,
  ) {
    const { responsible, address } = body

    const result = await this.editResponsibleUseCase.execute({
      responsible: {
        id: responsibleId,
        document: responsible.document,
        email: responsible.email,
        isActive: responsible.isActive,
        name: responsible.name,
        phone: responsible.phone,
      },
      address: {
        id: address.id,
        street: address.street,
        number: address.number,
        neighborhood: address.neighborhood,
        complement: address.complement,
        state: address.state,
        city: address.city,
      },
    })

    if (result.isLeft()) {
      switch (result.value.constructor) {
        case InvalidDocumentError:
          throw new BadRequestException('Invalid document')
        case ResponsibleNotFoundError:
          throw new NotFoundException('Responsible not found')
        default:
          throw new InternalServerErrorException()
      }
    }
  }
}

export const EditResponsibleBodySchema = generateSchema(
  editResponsibleBodySchema,
)
export const EditResponsibleParamSchema = generateSchema(
  editResponsibleParamsSchema,
)
