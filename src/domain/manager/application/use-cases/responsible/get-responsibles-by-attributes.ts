import { Injectable } from '@nestjs/common'
import { ResponsiblesRepository } from '../../repositories/responsible/responsible-repository'
import { Either, left, right } from '@/core/either'
import { ResponsibleDetails } from './value-object/responsible-details'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

export interface GetResponsiblesByAttributesRequest {
  id?: string
  name?: string
  document?: string
  phone?: string
  email?: string
}

type GetResponsiblesByAttributesResponse = Either<
  ResourceNotFoundError,
  ResponsibleDetails[]
>

@Injectable()
export class GetResponsibleByAttributesUseCase {
  constructor(private responsiblesRepository: ResponsiblesRepository) {}

  async execute(
    request: GetResponsiblesByAttributesRequest,
  ): Promise<GetResponsiblesByAttributesResponse> {
    console.log(request)

    const responsible =
      await this.responsiblesRepository.findDetailsByAttributes(request)

    if (!responsible) {
      return left(
        new ResourceNotFoundError(
          `Responsible Not Found with attributes "${request}".`,
        ),
      )
    }

    return right(responsible)
  }
}
