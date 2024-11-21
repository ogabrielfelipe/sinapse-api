import { Injectable } from '@nestjs/common'
import { ResponsiblesRepository } from '../../repositories/responsible/responsible-repository'
import { HashComparer } from '../../cryptography/hash-comparer'
import { Encrypter } from '../../cryptography/encrypter'
import { Either, left, right } from '@/core/either'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateResponsibleUseCaseRequest {
  email: string
  password: string
}

type AuthenticateResponsibleUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateResponsibleUseCase {
  constructor(
    private responsibleRepository: ResponsiblesRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateResponsibleUseCaseRequest): Promise<AuthenticateResponsibleUseCaseResponse> {
    const responsible = await this.responsibleRepository.findByEmail(email)

    if (!responsible) {
      return left(new WrongCredentialsError())
    }

    const hashedPassword = await this.hashComparer.compare(
      password,
      responsible.password,
    )

    if (!hashedPassword) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: responsible.id.toString(),
      roles: ['RESPONSIBLE'],
    })

    return right({ accessToken })
  }
}
