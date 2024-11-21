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
import { ResponsibleAddress } from '@/domain/manager/enterprise/entities/responsible-address'
import { ResponsibleAddressesRepository } from '../../repositories/responsible/address-responsible-repository'
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
    private responsibleAddressRepository: ResponsibleAddressesRepository,
  ) {}

  async execute(
    request: EditResponsibleUseCaseRequest,
  ): Promise<EditResponsibleUseCaseResponse> {
    const responsible = await this.responsibleRepository.findById(
      request.responsible.id,
    )
    const address = await this.responsibleAddressRepository.findById(
      request.address.id,
    )

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

    const responsibleDomain = Responsible.create(
      {
        name: responsible.name,
        email: responsible.email,
        document: responsible.document,
        isActive: responsible.isActive,
        phone: responsible.phone,
        password: '',
      },
      responsible.id,
    )

    responsibleDomain.name = request.responsible.name
    responsibleDomain.email = request.responsible.email
    responsibleDomain.document = documentValidated
    responsibleDomain.isActive = request.responsible.isActive
    responsibleDomain.phone = request.responsible.phone

    const addressDomain = ResponsibleAddress.create(
      {
        city: address.city,
        complement: address.complement,
        neighborhood: address.neighborhood,
        number: address.number,
        responsibleId: address.responsibleId,
        state: address.state,
        street: address.street,
      },
      address.id,
    )

    addressDomain.street = request.address.street
    addressDomain.complement = request.address.complement
    addressDomain.neighborhood = request.address.neighborhood
    addressDomain.number = request.address.number
    addressDomain.city = request.address.city
    addressDomain.state = request.address.state

    try {
      Promise.all([
        this.responsibleRepository.save(responsibleDomain),
        this.responsibleAddressRepository.save(addressDomain),
      ])
      return right({})
    } catch (e) {
      console.log(e)
      return left(e)
    }
  }
}
