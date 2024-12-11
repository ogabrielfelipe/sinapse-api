import { createZodDto } from '@anatine/zod-nestjs'
import { generateSchema } from '@anatine/zod-openapi'
import {
  Controller,
  Get,
  HttpCode,
  InternalServerErrorException,
  NotFoundException,
  Query,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe'

import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { GetSchoolByAttributesUseCase } from '@/domain/manager/application/use-cases/school/get-school-by-attributes'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { SchoolDetailsPresenter } from '../../presenters/school/school-details-presenter'

const getSchoolsBodySchema = z.object({
  id: z.string().cuid2().optional(),
  name: z.string().optional(),
  shortName: z.string().optional(),
  document: z.string().optional(),
  email: z.string().email().optional(),
})

class GetSchoolsDto extends createZodDto(getSchoolsBodySchema) {}

@ApiTags('schools')
@Controller('/schools')
export class GetSchoolsController {
  constructor(
    private getSchoolByAttributesUseCase: GetSchoolByAttributesUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe({ query: getSchoolsBodySchema }))
  @ApiOperation({ summary: 'Get schools by attributes' })
  @ApiBody({ type: GetSchoolsDto })
  @ApiResponse({
    status: 200,
    description: 'Get Schools successfully',

    example: JSON.stringify({
      schools: [
        {
          schoolId: 'e98nyz1a24yhcmpw4arnf516',
          name: 'Empresa Exemplo Ltda',
          document: '12345678000195',
          shortName: 'Exemplo',
          email: 'contato@exemplo.com',
          isActive: true,
          address: {
            addressId: 'hop10ozery9z2mi3s9ggxxex',
            street: 'Rua das Flores',
            number: '123',
            neighborhood: 'Jardim das Rosas',
            complement: 'Apto 45',
            state: 'SP',
            city: 'São Paulo',
            createdAt: '2024-12-03T16:57:30.857Z',
            updatedAt: '2024-12-03T16:57:30.861Z',
            changeLog: [],
          },
          createdAt: '2024-12-03T16:57:30.858Z',
          updatedAt: '2024-12-03T16:57:30.867Z',
          changeLog: [],
        },
      ],
    }),
  })
  @ApiResponse({ status: 404, description: 'Schools not found' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async handle(@Query() query: GetSchoolsDto) {
    const { name, document, email, shortName, id } = query

    const result = await this.getSchoolByAttributesUseCase.execute({
      name,
      document,
      email,
      shortName,
      id,
    })

    if (result.isLeft()) {
      switch (result.value.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException('Schools not found')
        default:
          throw new InternalServerErrorException()
      }
    }

    const schools = result.value

    return {
      schools: schools.map(SchoolDetailsPresenter.toHTTP),
    }
  }
}

export const GetSchoolsSchema = generateSchema(getSchoolsBodySchema)
