import {
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common'
import { ZodError, ZodObject } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private schemas: { [key: string]: ZodObject<any> }) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const schema = this.schemas[metadata.type]
      return schema.parse(value)
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          statusCode: 400,
          errors: fromZodError(error).details,
        })
      }
    }
  }
}
