import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DocumentCNPJ } from '@/core/entities/value-object/document-cnpj'
import { SchoolDetails } from '@/domain/manager/application/use-cases/school/value-object/school-details'
import { ChangeLogEntry } from '@/domain/manager/enterprise/entities/address'
import {
  School as PrismaSchool,
  Address as PrismaAddress,
} from '@prisma/client'

export class PrismaSchoolDetailsMapper {
  static toDomain(school: PrismaSchool, address: PrismaAddress): SchoolDetails {
    const schoolDetails = SchoolDetails.create({
      schoolId: new UniqueEntityID(school.id),
      name: school.name,
      email: school.email,
      document: DocumentCNPJ.crateWithoutValidation(school.document),
      shortName: school.shortName,
      isActive: school.isActive,
      changeLog: Array.isArray(school.changeLog)
        ? (school.changeLog as unknown as ChangeLogEntry[])
        : [],
      createdAt: school.createdAt,
      updatedAt: school.updatedAt,
      address: {
        addressId: new UniqueEntityID(address.id),
        street: address.street,
        number: address.number,
        city: address.city,
        complement: address.complement,
        neighborhood: address.neighborhood,
        state: address.state,
        changeLog: Array.isArray(address.changeLog)
          ? (address.changeLog as unknown as ChangeLogEntry[])
          : [],
        createdAt: address.createdAt,
        updatedAt: address.updatedAt,
      },
    })

    return schoolDetails
  }
}
