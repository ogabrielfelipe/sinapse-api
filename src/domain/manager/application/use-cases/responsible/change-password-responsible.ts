import { Either, left, right } from '@/core/either'
import { ResponsibleNotFoundError } from './errors/responsible-not-found'
import { Injectable } from '@nestjs/common'
import { ResponsiblesRepository } from '../../repositories/responsible/responsible-repository'
import { HashGenerator } from '@/core/application/cryptography/hash-generator'
import { HashComparer } from '@/core/application/cryptography/hash-comparer'
import { PasswordAreSameError } from '@/core/errors/errors/password-are-same-error'

type ChangePasswordResponsibleUseCaseRequest = {
  id: string
  password: string
}

type ChangePasswordResponsibleUseCaseResponse = Either<
  ResponsibleNotFoundError | PasswordAreSameError,
  object
>

@Injectable()
export class ChangePasswordResponsibleUseCase {
  constructor(
    private responsibleRepository: ResponsiblesRepository,
    private hashGenerator: HashGenerator,
    private hashComparer: HashComparer,
  ) {}

  async execute({
    id,
    password,
  }: ChangePasswordResponsibleUseCaseRequest): Promise<ChangePasswordResponsibleUseCaseResponse> {
    const responsible = await this.responsibleRepository.findById(id)

    if (!responsible) {
      return left(new ResponsibleNotFoundError(id))
    }

    const passwordAreSame = await this.hashComparer.compare(
      password,
      responsible.password,
    )

    if (passwordAreSame) {
      return left(new PasswordAreSameError())
    }

    const passwordHashed = await this.hashGenerator.hash(password)

    await this.responsibleRepository.EditPassword(
      responsible.id.toString(),
      passwordHashed,
    )

    return right({})
  }
}
