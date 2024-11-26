import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DocumentCNPJ } from '@/core/entities/value-object/document-cnpj'
import { DocumentCPF } from '@/core/entities/value-object/document-cpf'
import { Responsible } from '@/domain/manager/enterprise/entities/responsible'
import { ChangeLogEntry } from '@/domain/manager/enterprise/entities/responsible-address'
import { User as PrismaUser, Prisma } from '@prisma/client'

export class PrismaResponsibleMapper {
  static toDomain(raw: PrismaUser): Responsible {
    const responsible = Responsible.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        document:
          raw.document.length > 11
            ? DocumentCNPJ.crateWithoutValidation(raw.document)
            : DocumentCPF.crateWithoutValidation(raw.document),
        phone: raw.phone,
        isActive: raw.isActive,
        changeLog: Array.isArray(raw.changeLog)
          ? (raw.changeLog as unknown as ChangeLogEntry[])
          : [],
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )

    return responsible
  }

  static toPrisma(responsible: Responsible): Prisma.UserUncheckedCreateInput {
    return {
      id: responsible.id.toString(),
      name: responsible.name,
      email: responsible.email,
      password: responsible.password,
      document: responsible.document.value,
      phone: responsible.phone,
      isActive: responsible.isActive,
      changeLog: JSON.stringify(responsible.changeLog),
      createdAt: responsible.createdAt,
      updatedAt: responsible.updatedAt,
    }
  }
}
