import { Injectable } from '@nestjs/common'
import { ResponsiblesRepository } from '../../repositories/responsible/responsible-repository'
import { Either, left, right } from '@/core/either'
import { ResponsibleNotFoundError } from './errors/responsible-not-found'

type DeleteResponsibleUseCaseRequest = {
  id: string
}

type DeleteResponsibleUseCaseResponse = Either<ResponsibleNotFoundError, object>

@Injectable()
export class DeleteResponsibleUseCase {
  constructor(private responsibleRepository: ResponsiblesRepository) {}

  async execute({
    id,
  }: DeleteResponsibleUseCaseRequest): Promise<DeleteResponsibleUseCaseResponse> {
    const responsible = await this.responsibleRepository.findById(id)

    if (!responsible) {
      return left(new ResponsibleNotFoundError(id))
    }

    await this.responsibleRepository.delete(id)

    return right({})
  }
}
