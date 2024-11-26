import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ChangeLogEntry,
  ResponsibleAddress,
} from '@/domain/manager/enterprise/entities/responsible-address'
import { Address as PrismaAddress, Prisma } from '@prisma/client'

export class PrismaAddressResponsibleMapper {
  static toDomain(raw: PrismaAddress): ResponsibleAddress {
    const address = ResponsibleAddress.create(
      {
        street: raw.state,
        number: raw.number,
        state: raw.state,
        city: raw.city,
        complement: raw.complement,
        neighborhood: raw.neighborhood,
        responsibleId: new UniqueEntityID(raw.userId),
        changeLog: Array.isArray(raw.changeLog)
          ? (raw.changeLog as unknown as ChangeLogEntry[])
          : [],
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )

    return address
  }

  static toPrisma(
    responsibleAddress: ResponsibleAddress,
  ): Prisma.AddressUncheckedCreateInput {
    return {
      id: responsibleAddress.id.toString(),
      street: responsibleAddress.street,
      number: responsibleAddress.number,
      city: responsibleAddress.city,
      complement: responsibleAddress.complement,
      neighborhood: responsibleAddress.neighborhood,
      state: responsibleAddress.state,
      changeLog: JSON.stringify(responsibleAddress.changeLog),
      userId: responsibleAddress.responsibleId.toString(),
      createdAt: responsibleAddress.createdAt,
      updatedAt: responsibleAddress.updatedAt,
    }
  }
}
