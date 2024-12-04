import { Injectable } from '@nestjs/common'
import { ResponsiblesRepository } from '../../../domain/manager/application/repositories/responsible/responsible-repository'

import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface IdentifyUserUseCaseRequest {
  id: string
}

type IdentifyUserUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    id: string
    name: string
    email: string
    roles: string[]
  }
>

const TYPE_ROLES = ['SECRETARY', 'RESPONSIBLE', 'ADMIN', 'STUDENT', 'TEACHER']

@Injectable()
export class IdentifyUseCase {
  constructor(private repository: ResponsiblesRepository) {}

  async execute({
    id,
  }: IdentifyUserUseCaseRequest): Promise<IdentifyUserUseCaseResponse> {
    const user = await this.repository.findById(id)

    if (!user) {
      return left(new ResourceNotFoundError(`Identifier not found`))
    }

    const roles = this.getRolesBasedOnRepositoryClass()

    const data = {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
      roles,
    }

    return right({ ...data })
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
