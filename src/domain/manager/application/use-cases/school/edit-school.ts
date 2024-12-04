import { School } from '@/domain/manager/enterprise/entities/school'
import { SchoolRepository } from '../../repositories/school/school-repository'
import { DocumentCNPJ } from '@/core/entities/value-object/document-cnpj'
import { InvalidCNPJError } from '@/core/errors/invalid-cnpj'
import { Either, left, right } from '@/core/either'
import { InvalidDocumentError } from '@/core/errors/invalid-document'
import { Injectable } from '@nestjs/common'
import { Address } from '@/domain/manager/enterprise/entities/address'
import { getDocumentType } from '@/core/utils/get-type-document'
import { AddressesRepository } from '../../repositories/address-repository'
import { ResponsiblesRepository } from '../../repositories/responsible/responsible-repository'
import { SchoolNotFoundError } from './errors/school-not-found'
import { AddressNotFoundError } from '../responsible/errors/address-not-found'

type EditSchoolUseCaseRequest = {
  id: string
  name: string
  shortName: string
  document: string
  email: string
  isActive: boolean
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

type EditSchoolUseCaseResponse = Either<
  SchoolNotFoundError | AddressNotFoundError | InvalidDocumentError,
  object
>

@Injectable()
export class EditSchoolUseCase {
  constructor(
    private schoolRepository: SchoolRepository,
    private addressRepository: AddressesRepository,
    private responsibleRepository: ResponsiblesRepository,
  ) {}

  async execute(
    request: EditSchoolUseCaseRequest,
  ): Promise<EditSchoolUseCaseResponse> {
    const school = await this.schoolRepository.findByDocument(request.document)

    if (!school) {
      return left(new SchoolNotFoundError(request.document))
    }

    const address = await this.addressRepository.findById(request.address.id)
    if (!address) {
      return left(new AddressNotFoundError(address?.id.toString()))
    }

    let documentValidated: DocumentCNPJ | InvalidCNPJError | null = null

    const documentType = getDocumentType(request.document)

    switch (documentType) {
      case 'CNPJ':
        documentValidated = DocumentCNPJ.create(request.document)
        break
      default:
        return left(new InvalidDocumentError())
    }

    if (documentValidated instanceof InvalidCNPJError) {
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

    const schoolDomain = School.create(
      {
        name: school.name,
        email: school.email,
        document: school.document,
        addressId: school.addressId,
        shortName: school.shortName,
        isActive: school.isActive,
      },
      school.id,
    )

    schoolDomain.name =
      request.name !== schoolDomain.name ? request.name : schoolDomain.name
    schoolDomain.shortName =
      request.shortName !== schoolDomain.shortName
        ? request.shortName
        : schoolDomain.shortName
    schoolDomain.email =
      request.email !== schoolDomain.email ? request.email : schoolDomain.email
    schoolDomain.document =
      documentValidated !== schoolDomain.document
        ? documentValidated
        : schoolDomain.document
    schoolDomain.isActive =
      request.isActive !== schoolDomain.isActive
        ? request.isActive
        : schoolDomain.isActive

    try {
      await this.addressRepository.save(addressDomain)
      await this.schoolRepository.save(schoolDomain)
    } catch (e) {
      console.log(e)
    }

    return right({})
  }
}
