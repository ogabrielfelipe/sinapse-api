import { Responsible } from '@/domain/manager/enterprise/entities/responsible'
import { ResponsiblesRepository } from '../../repositories/responsible/responsible-repository'
import { DocumentCNPJ } from '@/core/entities/value-object/document-cnpj'
import { DocumentCPF } from '@/core/entities/value-object/document-cpf'
import { InvalidCNPJError } from '@/core/errors/invalid-cnpj'
import { InvalidCPFError } from '@/core/errors/invalid-cpf'
import { Either, left, right } from '@/core/either'
import { ResponsibleAlreadyExistsError } from './errors/responsible-already-exists-error'
import { InvalidDocumentError } from '@/core/errors/invalid-document'
import { HashGenerator } from '@/core/application/cryptography/hash-generator'
import { Injectable } from '@nestjs/common'
import { ResponsibleAddress } from '@/domain/manager/enterprise/entities/responsible-address'
import { getDocumentType } from '@/core/utils/get-type-document'
import { ResponsibleAddressesRepository } from '../../repositories/responsible/address-responsible-repository'

type RegisterResponsibleUseCaseRequest = {
  name: string
  document: string
  password: string
  phone: string
  email: string
  address: {
    street: string
    number: string
    neighborhood: string
    complement: string
    state: string
    city: string
  }
}

type RegisterResponsibleUseCaseResponse = Either<
  ResponsibleAlreadyExistsError | InvalidDocumentError,
  object
>

@Injectable()
export class RegisterResponsibleUseCase {
  constructor(
    private responsibleRepository: ResponsiblesRepository,
    private responsibleAddressRepository: ResponsibleAddressesRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    request: RegisterResponsibleUseCaseRequest,
  ): Promise<RegisterResponsibleUseCaseResponse> {
    const responsibleAlreadyExists =
      await this.responsibleRepository.findByEmail(request.email)

    if (responsibleAlreadyExists) {
      return left(new ResponsibleAlreadyExistsError(request.email))
    }

    let documentValidated:
      | DocumentCNPJ
      | DocumentCPF
      | InvalidCNPJError
      | InvalidCPFError
      | null = null

    const documentType = getDocumentType(request.document)

    switch (documentType) {
      case 'CPF':
        documentValidated = DocumentCPF.create(request.document)
        break
      case 'CNPJ':
        documentValidated = DocumentCNPJ.create(request.document)
        break
      default:
        return left(new InvalidDocumentError())
    }

    if (
      documentValidated instanceof InvalidCNPJError ||
      documentValidated instanceof InvalidCPFError
    ) {
      return left(new InvalidDocumentError())
    }

    const passwordHashed = await this.hashGenerator.hash(request.password)

    const addressResponsible = request.address
    delete request.address

    const responsible = Responsible.create({
      ...request,
      document: documentValidated,
      password: passwordHashed,
      isActive: true,
    })

    const responsibleAddress = ResponsibleAddress.create({
      ...addressResponsible,
      responsibleId: responsible.id,
    })

    Promise.all([
      this.responsibleRepository.create(responsible),
      this.responsibleAddressRepository.create(responsibleAddress),
    ])

    return right({})
  }
}
