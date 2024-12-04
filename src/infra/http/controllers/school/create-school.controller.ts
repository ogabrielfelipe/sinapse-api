import { createZodDto } from '@anatine/zod-nestjs'
import { generateSchema } from '@anatine/zod-openapi'
import { CreateSchoolUseCase } from '@/domain/manager/application/use-cases/school/create-school'
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
import { SchoolAlreadyExistsError } from '@/domain/manager/application/use-cases/school/errors/school-already-exists-error'

const createSchoolBodySchema = z.object({
  name: z.string().min(1).max(255),
  shortName: z.string().min(1).max(150),
  document: z.string().min(14).max(14),
  email: z.string().email().max(255),
  address: z.object({
    street: z.string().min(1),
    number: z.string().min(1),
    neighborhood: z.string().min(1),
    complement: z.string().min(1),
    state: z.string().min(1),
    city: z.string().min(1),
  }),
})

class CreateSchoolDto extends createZodDto(createSchoolBodySchema) {}

@ApiTags('schools')
@Controller('/schools')
export class CreateSchoolController {
  constructor(private registerSchool: CreateSchoolUseCase) {}

  @Post()
  @HttpCode(201)
  @UsePipes(new ZodValidationPipe({ body: createSchoolBodySchema }))
  @ApiOperation({ summary: 'Create a new school' })
  @ApiBody({ type: CreateSchoolDto })
  @ApiResponse({ status: 201, description: 'School created successfully' })
  @ApiResponse({ status: 400, description: 'Document invalid' })
  @ApiResponse({ status: 409, description: 'School already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async handle(@Body() body: CreateSchoolDto) {
    const { name, document, email, shortName, address } = body

    const result = await this.registerSchool.execute({
      name,
      shortName,
      document,
      email,
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
        case SchoolAlreadyExistsError:
          throw new ConflictException('School already exists')
        default:
          throw new InternalServerErrorException()
      }
    }
  }
}

export const CreateSchoolSchema = generateSchema(createSchoolBodySchema)
