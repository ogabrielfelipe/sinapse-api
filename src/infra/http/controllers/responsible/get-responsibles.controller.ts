import { createZodDto } from '@anatine/zod-nestjs'
import { generateSchema } from '@anatine/zod-openapi'
import {
  BadRequestException,
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
import { InvalidDocumentError } from '@/core/errors/invalid-document'
import { GetResponsibleByAttributesUseCase } from '@/domain/manager/application/use-cases/responsible/get-responsibles-by-attributes'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { ResponsibleDetailsPresenter } from '../../presenters/responsible/responsible-details-presenter'

const getResponsiblesBodySchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  document: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
})

class GetResponsiblesDto extends createZodDto(getResponsiblesBodySchema) {}

@ApiTags('responsibles')
@Controller('/responsibles')
export class GetResponsiblesController {
  constructor(
    private getResponsibleByAttributesUseCase: GetResponsibleByAttributesUseCase,
  ) {}

  @Get()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe({ query: getResponsiblesBodySchema }))
  @ApiOperation({ summary: 'Get responsibles by attributes' })
  @ApiBody({ type: GetResponsiblesDto })
  @ApiResponse({ status: 200, description: 'Responsible created successfully' })
  @ApiResponse({ status: 400, description: 'Document invalid' })
  @ApiResponse({ status: 404, description: 'Responsibles not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async handle(@Query() query: GetResponsiblesDto) {
    const { name, document, email, phone, id } = query

    const result = await this.getResponsibleByAttributesUseCase.execute({
      name,
      document,
      email,
      phone,
      id,
    })

    if (result.isLeft()) {
      switch (result.value.constructor) {
        case InvalidDocumentError:
          throw new BadRequestException('Invalid document')
        case ResourceNotFoundError:
          throw new NotFoundException('Responsibles not found')
        default:
          throw new InternalServerErrorException()
      }
    }

    const responsibles = result.value

    return {
      responsibles: responsibles.map(ResponsibleDetailsPresenter.toHTTP),
    }
  }
}

export const GetResponsiblesSchema = generateSchema(getResponsiblesBodySchema)
