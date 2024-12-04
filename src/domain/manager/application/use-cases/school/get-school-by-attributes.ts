import { Injectable } from '@nestjs/common'
import { SchoolRepository } from '../../repositories/school/school-repository'
import { Either, left, right } from '@/core/either'
import { SchoolDetails } from './value-object/school-details'
import { SchoolNotFoundError } from './errors/school-not-found'

export interface GetSchoolByAttributesRequest {
  id?: string
  name?: string
  shortName?: string
  document?: string
  email?: string
}

type GetSchoolByAttributesResponse = Either<
  SchoolNotFoundError,
  SchoolDetails[]
>

@Injectable()
export class GetSchoolByAttributesUseCase {
  constructor(private schoolRepository: SchoolRepository) {}

  async execute(
    request: GetSchoolByAttributesRequest,
  ): Promise<GetSchoolByAttributesResponse> {
    const school = await this.schoolRepository.findDetailsByAttributes(request)

    if (!school) {
      return left(
        new SchoolNotFoundError(
          `School Not Found with attributes "${request}".`,
        ),
      )
    }

    return right(school)
  }
}
