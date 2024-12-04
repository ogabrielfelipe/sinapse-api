import { Injectable } from '@nestjs/common'
import { SchoolRepository } from '../../repositories/school/school-repository'
import { Either, left, right } from '@/core/either'
import { SchoolNotFoundError } from '../school/errors/school-not-found'

type DeleteSchoolUseCaseRequest = {
  id: string
}

type DeleteSchoolUseCaseResponse = Either<SchoolNotFoundError, object>

@Injectable()
export class DeleteSchoolUseCase {
  constructor(private schoolRepository: SchoolRepository) {}

  async execute({
    id,
  }: DeleteSchoolUseCaseRequest): Promise<DeleteSchoolUseCaseResponse> {
    const school = await this.schoolRepository.findById(id)

    if (!school) {
      return left(new SchoolNotFoundError(id))
    }

    await this.schoolRepository.delete(id)

    return right({})
  }
}
