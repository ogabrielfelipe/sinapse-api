import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ChangeLogEntry,
  Address,
} from '@/domain/manager/enterprise/entities/address'
import { Address as PrismaAddress, Prisma } from '@prisma/client'

export class PrismaAddressMapper {
  static toDomain(raw: PrismaAddress): Address {
    const changeLog: ChangeLogEntry[] = JSON.parse(raw.changeLog.toString())

    const address = Address.create(
      {
        street: raw.street,
        number: raw.number,
        state: raw.state,
        city: raw.city,
        complement: raw.complement,
        neighborhood: raw.neighborhood,
        changeLog,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )

    return address
  }

  static toPrisma(address: Address): Prisma.AddressUncheckedCreateInput {
    return {
      id: address.id.toString(),
      street: address.street,
      number: address.number,
      city: address.city,
      complement: address.complement,
      neighborhood: address.neighborhood,
      state: address.state,
      changeLog: JSON.stringify(address.changeLog),
      createdAt: address.createdAt,
      updatedAt: address.updatedAt,
    }
  }
}
