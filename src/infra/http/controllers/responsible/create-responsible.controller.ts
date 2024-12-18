import { createZodDto } from '@anatine/zod-nestjs'
import { generateSchema } from '@anatine/zod-openapi'
import { CreateResponsibleUseCase } from '@/domain/manager/application/use-cases/responsible/create-responsible'
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  InternalServerErrorException,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe'

import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { InvalidDocumentError } from '@/core/errors/invalid-document'
import { ResponsibleAlreadyExistsError } from '@/domain/manager/application/use-cases/responsible/errors/responsible-already-exists-error'

const createResponsibleBodySchema = z.object({
  name: z.string().min(1).max(255),
  document: z.string().min(1).max(14),
  email: z.string().email().max(255),
  phone: z.string().min(1).max(11),
  password: z.string().min(6).max(255),
  address: z.object({
    street: z.string().min(1),
    number: z.string().min(1),
    neighborhood: z.string().min(1),
    complement: z.string().min(1),
    state: z.string().min(1),
    city: z.string().min(1),
  }),
})

class CreateResponsibleDto extends createZodDto(createResponsibleBodySchema) {}

@ApiTags('responsibles')
@Controller('/responsibles')
export class CreateResponsibleController {
  constructor(private registerResponsible: CreateResponsibleUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe({ body: createResponsibleBodySchema }))
  @ApiOperation({ summary: 'Create a new responsible' })
  @ApiBody({ type: CreateResponsibleDto })
  @ApiResponse({ status: 201, description: 'Responsible created successfully' })
  @ApiResponse({ status: 400, description: 'Document invalid' })
  @ApiResponse({ status: 409, description: 'Responsible already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async handle(@Body() body: CreateResponsibleDto) {
    const { name, document, email, phone, password, address } = body

    const result = await this.registerResponsible.execute({
      name,
      document,
      email,
      phone,
      password,
      address: {
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
        case ResponsibleAlreadyExistsError:
          throw new ConflictException('Responsible already exists')
        default:
          throw new InternalServerErrorException()
      }
    }
  }
}

export const CreateResponsibleSchema = generateSchema(
  createResponsibleBodySchema,
)
