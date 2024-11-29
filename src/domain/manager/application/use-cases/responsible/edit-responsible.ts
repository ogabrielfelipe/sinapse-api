import { Responsible } from '@/domain/manager/enterprise/entities/responsible'
import { Either, left, right } from '@/core/either'
import { ResponsibleNotFoundError } from './errors/responsible-not-found'
import { InvalidDocumentError } from '@/core/errors/invalid-document'
import { Injectable } from '@nestjs/common'
import { ResponsiblesRepository } from '../../repositories/responsible/responsible-repository'
import { getDocumentType } from '@/core/utils/get-type-document'
import { DocumentCNPJ } from '@/core/entities/value-object/document-cnpj'
import { InvalidCNPJError } from '@/core/errors/invalid-cnpj'
import { DocumentCPF } from '@/core/entities/value-object/document-cpf'
import { InvalidCPFError } from '@/core/errors/invalid-cpf'
import { Address } from '@/domain/manager/enterprise/entities/address'
import { AddressesRepository } from '../../repositories/responsible/address-repository'
import { AddressNotFoundError } from './errors/address-not-found'

type EditResponsibleUseCaseRequest = {
  responsible: {
    id: string
    name: string
    document: string
    phone: string
    email: string
    isActive: boolean
  }
  address: {
    id: string
    street: string
    number: string
    neighborhood: string
    complement: string
    state: string
    city: string
  }
}

type EditResponsibleUseCaseResponse = Either<
  ResponsibleNotFoundError | InvalidDocumentError,
  object
>

@Injectable()
export class EditResponsibleUseCase {
  constructor(
    private responsibleRepository: ResponsiblesRepository,
    private addressRepository: AddressesRepository,
  ) {}

  async execute(
    request: EditResponsibleUseCaseRequest,
  ): Promise<EditResponsibleUseCaseResponse> {
    const responsible = await this.responsibleRepository.findById(
      request.responsible.id,
    )
    const address = await this.addressRepository.findById(request.address.id)

    if (!responsible) {
      return left(new ResponsibleNotFoundError(responsible?.name))
    }

    if (!address) {
      return left(new AddressNotFoundError(address?.id.toString()))
    }

    let documentValidated:
      | DocumentCNPJ
      | DocumentCPF
      | InvalidCNPJError
      | InvalidCPFError
      | null = null

    const documentType = getDocumentType(request.responsible.document)

    switch (documentType) {
      case 'CPF':
        documentValidated = DocumentCPF.create(request.responsible.document)
        break
      case 'CNPJ':
        documentValidated = DocumentCNPJ.create(request.responsible.document)
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

    const addressDomain = Address.create(
      {
        city: address.city,
        complement: address.complement,
        neighborhood: address.neighborhood,
        number: address.number,
        state: address.state,
        street: address.street,
      },
      address.id,
    )

    const responsibleDomain = Responsible.create(
      {
        name: responsible.name,
        email: responsible.email,
        document: responsible.document,
        isActive: responsible.isActive,
        phone: responsible.phone,
        addressId: addressDomain.id,
        password: '',
      },
      responsible.id,
    )

    responsibleDomain.name =
      request.responsible.name !== responsibleDomain.name
        ? request.responsible.name
        : responsibleDomain.name
    responsibleDomain.email =
      request.responsible.email !== responsibleDomain.email
        ? request.responsible.email
        : responsibleDomain.email
    responsibleDomain.document =
      documentValidated !== responsibleDomain.document
        ? documentValidated
        : responsibleDomain.document
    responsibleDomain.isActive =
      request.responsible.isActive !== responsibleDomain.isActive
        ? request.responsible.isActive
        : responsibleDomain.isActive
    responsibleDomain.phone =
      request.responsible.phone !== responsibleDomain.phone
        ? request.responsible.phone
        : responsibleDomain.phone

    addressDomain.street =
      request.address.street !== addressDomain.street
        ? request.address.street
        : addressDomain.street
    addressDomain.complement =
      request.address.complement !== addressDomain.complement
        ? request.address.complement
        : addressDomain.complement
    addressDomain.neighborhood =
      request.address.neighborhood !== addressDomain.neighborhood
        ? request.address.neighborhood
        : addressDomain.neighborhood
    addressDomain.number =
      request.address.number !== addressDomain.number
        ? request.address.number
        : addressDomain.number
    addressDomain.city =
      request.address.city !== addressDomain.city
        ? request.address.city
        : addressDomain.city
    addressDomain.state =
      request.address.state !== addressDomain.state
        ? request.address.state
        : addressDomain.state

    await this.responsibleRepository.save(responsibleDomain)
    await this.addressRepository.save(addressDomain)

    return right({})
  }
}
