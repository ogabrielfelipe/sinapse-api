import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DocumentCNPJ } from '@/core/entities/value-object/document-cnpj'
import { DocumentCPF } from '@/core/entities/value-object/document-cpf'
import { ResponsibleDetails } from '@/domain/manager/application/use-cases/responsible/value-object/responsible-details'
import { ChangeLogEntry } from '@/domain/manager/enterprise/entities/responsible-address'
import { User as PrismaUser, Address as PrismaAddress } from '@prisma/client'

export class PrismaResponsibleDetailsMapper {
  static toDomain(
    responsible: PrismaUser,
    address: PrismaAddress,
  ): ResponsibleDetails {
    const responsibleDetails = ResponsibleDetails.create({
      responsibleId: new UniqueEntityID(responsible.id),
      name: responsible.name,
      email: responsible.email,
      document:
        responsible.document.length > 11
          ? DocumentCNPJ.crateWithoutValidation(responsible.document)
          : DocumentCPF.crateWithoutValidation(responsible.document),
      phone: responsible.phone,
      isActive: responsible.isActive,
      changeLog: Array.isArray(responsible.changeLog)
        ? (responsible.changeLog as unknown as ChangeLogEntry[])
        : [],
      createdAt: responsible.createdAt,
      updatedAt: responsible.updatedAt,
      address: {
        addressId: new UniqueEntityID(address.id),
        street: address.street,
        number: address.number,
        city: address.city,
        complement: address.complement,
        neighborhood: address.neighborhood,
        responsibleId: new UniqueEntityID(address.userId),
        state: address.state,
        changeLog: Array.isArray(address.changeLog)
          ? (address.changeLog as unknown as ChangeLogEntry[])
          : [],
        createdAt: address.createdAt,
        updatedAt: address.updatedAt,
      },
    })

    return responsibleDetails
  }
}
