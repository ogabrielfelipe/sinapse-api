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
import { Address } from '@/domain/manager/enterprise/entities/address'
import { getDocumentType } from '@/core/utils/get-type-document'
import { AddressesRepository } from '../../repositories/responsible/address-repository'

type CreateResponsibleUseCaseRequest = {
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

type CreateResponsibleUseCaseResponse = Either<
  ResponsibleAlreadyExistsError | InvalidDocumentError,
  object
>

@Injectable()
export class CreateResponsibleUseCase {
  constructor(
    private responsibleRepository: ResponsiblesRepository,
    private addressRepository: AddressesRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    request: CreateResponsibleUseCaseRequest,
  ): Promise<CreateResponsibleUseCaseResponse> {
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

    const address = Address.create({
      ...addressResponsible,
    })

    const responsible = Responsible.create({
      name: request.name,
      email: request.email,
      phone: request.phone,
      document: documentValidated,
      password: passwordHashed,
      addressId: address.id,
      isActive: true,
    })

    try {
      await this.addressRepository.create(address)
      await this.responsibleRepository.create(responsible)
    } catch (e) {
      console.log(e)
    }

    return right({})
  }
}
