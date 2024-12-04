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
import { SchoolNotFoundError } from '@/domain/manager/application/use-cases/school/errors/school-not-found'
import { DeleteSchoolUseCase } from '@/domain/manager/application/use-cases/school/delete-school'

const deleteSchoolParamsSchema = z.object({
  schoolId: z.string(),
})

class DeleteSchoolParamDto extends createZodDto(deleteSchoolParamsSchema) {}

@ApiTags('schools')
@Controller('/schools/:schoolId')
export class DeleteSchoolController {
  constructor(private deleteSchoolUseCase: DeleteSchoolUseCase) {}

  @Delete()
  @HttpCode(200)
  @UsePipes(
    new ZodValidationPipe({
      param: deleteSchoolParamsSchema,
    }),
  )
  @ApiOperation({ summary: 'Delete a school' })
  @ApiBody({ type: DeleteSchoolParamDto })
  @ApiResponse({ status: 200, description: 'School deleted successfully' })
  @ApiResponse({ status: 400, description: 'Invalid type' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 404, description: 'School not found' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async handle(@Param() { schoolId }: DeleteSchoolParamDto) {
    const result = await this.deleteSchoolUseCase.execute({
      id: schoolId,
    })

    if (result.isLeft()) {
      switch (result.value.constructor) {
        case ZodError:
          throw new BadRequestException(
            `Validation fields. Error: ${result.value}`,
          )
        case SchoolNotFoundError:
          throw new NotFoundException('School not found')
        default:
          throw new InternalServerErrorException()
      }
    }
  }
}

export const DeleteSchoolBodySchema = generateSchema(deleteSchoolParamsSchema)
