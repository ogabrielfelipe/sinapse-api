import { createZodDto } from '@anatine/zod-nestjs'
import { generateSchema } from '@anatine/zod-openapi'
import { EditSchoolUseCase } from '@/domain/manager/application/use-cases/school/edit-school'
import {
  BadRequestException,
  Body,
  ConflictException,
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
import { SchoolAlreadyExistsError } from '@/domain/manager/application/use-cases/school/errors/school-already-exists-error'
import { AddressNotFoundError } from '@/domain/manager/application/use-cases/responsible/errors/address-not-found'

const editSchoolParamsSchema = z.object({
  schoolId: z.string().cuid2(),
})

const editSchoolBodySchema = z.object({
  name: z.string().min(1).max(255),
  shortName: z.string().min(1).max(150),
  document: z.string().min(14).max(14),
  email: z.string().email().max(255),
  isActive: z.boolean({ coerce: true }),
  address: z.object({
    id: z.string().cuid2(),
    street: z.string().min(1),
    number: z.string().min(1),
    neighborhood: z.string().min(1),
    complement: z.string().min(1),
    state: z.string().min(1),
    city: z.string().min(1),
  }),
})

class EditSchoolParamDto extends createZodDto(editSchoolParamsSchema) {}

class EditSchoolDto extends createZodDto(editSchoolBodySchema) {}

@ApiTags('schools')
@Controller('/schools/:schoolId')
export class EditSchoolController {
  constructor(private registerSchool: EditSchoolUseCase) {}

  @Put()
  @HttpCode(201)
  @UsePipes(
    new ZodValidationPipe({
      param: editSchoolParamsSchema,
      body: editSchoolBodySchema,
    }),
  )
  @ApiOperation({ summary: 'Update a school' })
  @ApiBody({ type: EditSchoolParamDto })
  @ApiBody({ type: EditSchoolDto })
  @ApiResponse({ status: 201, description: 'School edit successfully' })
  @ApiResponse({ status: 400, description: 'Document invalid' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  @ApiResponse({ status: 409, description: 'School already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async handle(
    @Param() { schoolId }: EditSchoolParamDto,
    @Body() body: EditSchoolDto,
  ) {
    const { name, shortName, document, email, isActive, address } = body

    const result = await this.registerSchool.execute({
      id: schoolId,
      name,
      shortName,
      document,
      email,
      isActive,
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
        case AddressNotFoundError:
          throw new NotFoundException('Address not found')
        case SchoolAlreadyExistsError:
          throw new ConflictException('School already exists')
        default:
          throw new InternalServerErrorException()
      }
    }
  }
}

export const EditSchoolSchema = generateSchema(editSchoolBodySchema)
export const EditSchoolParamSchema = generateSchema(editSchoolParamsSchema)
