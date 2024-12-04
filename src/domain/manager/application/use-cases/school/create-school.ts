import { School } from '@/domain/manager/enterprise/entities/school'
import { SchoolRepository } from '../../repositories/school/school-repository'
import { DocumentCNPJ } from '@/core/entities/value-object/document-cnpj'
import { InvalidCNPJError } from '@/core/errors/invalid-cnpj'
import { Either, left, right } from '@/core/either'
import { SchoolAlreadyExistsError } from './errors/school-already-exists-error'
import { InvalidDocumentError } from '@/core/errors/invalid-document'
import { Injectable } from '@nestjs/common'
import { Address } from '@/domain/manager/enterprise/entities/address'
import { getDocumentType } from '@/core/utils/get-type-document'
import { AddressesRepository } from '../../repositories/address-repository'
import { ResponsiblesRepository } from '../../repositories/responsible/responsible-repository'

type CreateSchoolUseCaseRequest = {
  name: string
  shortName: string
  document: string
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

type CreateSchoolUseCaseResponse = Either<
  SchoolAlreadyExistsError | InvalidDocumentError,
  object
>

@Injectable()
export class CreateSchoolUseCase {
  constructor(
    private schoolRepository: SchoolRepository,
    private addressRepository: AddressesRepository,
    private responsibleRepository: ResponsiblesRepository,
  ) {}

  async execute(
    request: CreateSchoolUseCaseRequest,
  ): Promise<CreateSchoolUseCaseResponse> {
    const schoolAlreadyExists = await this.schoolRepository.findByDocument(
      request.document,
    )

    if (schoolAlreadyExists) {
      return left(new SchoolAlreadyExistsError(request.email))
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

    const addressSchool = request.address

    const address = Address.create({
      ...addressSchool,
    })

    const school = School.create({
      name: request.name,
      email: request.email,
      document: documentValidated,
      addressId: address.id,
      shortName: request.shortName,
      isActive: true,
    })

    try {
      await this.addressRepository.create(address)
      await this.schoolRepository.create(school)
    } catch (e) {
      console.log(e)
    }

    return right({})
  }
}
