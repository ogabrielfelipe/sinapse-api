import { Injectable } from '@nestjs/common'
import { ResponsiblesRepository } from '../../../domain/manager/application/repositories/responsible/responsible-repository'

import { Either, left, right } from '@/core/either'
import { WrongCredentialsError } from '../../../domain/manager/application/use-cases/responsible/errors/wrong-credentials-error'
import { Encrypter } from '../cryptography/encrypter'
import { HashComparer } from '../cryptography/hash-comparer'

interface AuthenticateUserUseCaseRequest {
  email: string
  password: string
}

type AuthenticateUserUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

const TYPE_ROLES = ['SECRETARY', 'RESPONSIBLE', 'ADMIN', 'STUDENT', 'TEACHER']

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private repository: ResponsiblesRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateUserUseCaseRequest): Promise<AuthenticateUserUseCaseResponse> {
    const user = await this.repository.findByEmail(email)

    if (!user) {
      return left(new WrongCredentialsError())
    }

    const hashedPassword = await this.hashComparer.compare(
      password,
      user.password,
    )

    if (!hashedPassword) {
      return left(new WrongCredentialsError())
    }

    const roles = this.getRolesBasedOnRepositoryClass()

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
      roles,
    })

    return right({ accessToken })
  }

  private verifyRoleInClass(raw: string, className: string) {
    const regex = new RegExp(`\\b${raw}\\b`, 'i')
    return regex.test(className)
  }

  private getRepositoryName() {
    const classNameRepository = this.repository.constructor.name.replace(
      /([a-z])([A-Z])/g,
      '$1 $2',
    )
    return classNameRepository
  }

  private getRolesBasedOnRepositoryClass() {
    const verifyRepository = TYPE_ROLES.map((type) => {
      if (this.verifyRoleInClass(type, this.getRepositoryName())) {
        return type
      }
      return null
    }).filter((role) => role !== null)

    return verifyRepository
  }
}
