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
  @ApiResponse({
    status: 200,
    description: 'Get Responsibles successfully',

    example: JSON.stringify({
      responsibles: [
        {
          responsibleId: 'cwke15np48n1o5wmjzxh3dys',
          name: 'John Doe',
          document: '86073051310',
          phone: '22999995555',
          email: 'john.doe@example.com',
          isActive: true,
          address: {
            addressId: 'vpiiymh6eojxmqkclp7wysqt',
            responsibleId: 'rcfmp3k6mqaf3uer2y3iml6r',
            street: 'Harrison Street',
            number: '7',
            neighborhood: 'Lee County',
            complement: 'Northwest',
            state: 'Cuba',
            city: 'Ankundingworth',
            createdAt: '2024-11-27T03:28:53.910Z',
            updatedAt: '2024-11-27T03:28:53.913Z',
            changeLog: [
              {
                field: 'street',
                oldValue: 'Harrison',
                newValue: 'Harrison Street',
                timestamp: '2024-11-27T03:28:53.913Z',
              },
            ],
          },
          createdAt: '2024-11-27T02:51:23.644Z',
          updatedAt: '2024-11-27T02:51:23.652Z',
          changeLog: [
            {
              field: 'name',
              oldValue: 'John',
              newValue: 'John Doe',
              timestamp: '2024-11-27T02:51:23.652Z',
            },
          ],
        },
      ],
    }),
  })
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
