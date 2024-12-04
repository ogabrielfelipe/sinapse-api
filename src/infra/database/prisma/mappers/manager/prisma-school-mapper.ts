import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DocumentCNPJ } from '@/core/entities/value-object/document-cnpj'
import { School } from '@/domain/manager/enterprise/entities/school'
import { ChangeLogEntry } from '@/domain/manager/enterprise/entities/address'
import { School as PrismaSchool, Prisma } from '@prisma/client'

export class PrismaSchoolMapper {
  static toDomain(raw: PrismaSchool): School {
    const school = School.create(
      {
        name: raw.name,
        email: raw.email,
        shortName: raw.shortName,
        document: DocumentCNPJ.crateWithoutValidation(raw.document),
        isActive: raw.isActive,
        addressId: new UniqueEntityID(raw.addressId),
        changeLog: Array.isArray(raw.changeLog)
          ? (raw.changeLog as unknown as ChangeLogEntry[])
          : [],
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )

    return school
  }

  static toPrisma(school: School): Prisma.SchoolUncheckedCreateInput {
    return {
      id: school.id.toString(),
      name: school.name,
      email: school.email,
      document: school.document.value,
      shortName: school.shortName,
      isActive: school.isActive,
      addressId: school.addressId.toString(),
      changeLog: JSON.stringify(school.changeLog),
      createdAt: school.createdAt,
      updatedAt: school.updatedAt,
    }
  }
}
