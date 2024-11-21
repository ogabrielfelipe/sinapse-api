import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DocumentCNPJ } from '@/core/entities/value-object/document-cnpj'
import { DocumentCPF } from '@/core/entities/value-object/document-cpf'
import { AddressResponsible } from '@/domain/manager/enterprise/entities/responsible-address'
import { Responsible } from '@/domain/manager/enterprise/entities/responsible'
import {
  User as PrismaUser,
  Address as PrismaAddress,
  Prisma,
} from '@prisma/client'

interface PrismaResponsibleResponse {
  address: AddressResponsible | null
  responsible: Responsible
}

export class PrismaResponsibleMapper {
  static toDomain(
    raw: PrismaUser & { address: PrismaAddress | null },
  ): PrismaResponsibleResponse {
    let addressDomain = null

    if (raw.address) {
      addressDomain = AddressResponsible.create({
        street: raw.address.street,
        number: String(raw.address.number),
        neighborhood: raw.address.neighborhood,
        complement: raw.address.complement,
        city: raw.address.city,
        state: raw.address.state,
      })
    }

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
        addressId: new UniqueEntityID(raw.addressId),
        isActive: raw.isActive,
      },
      new UniqueEntityID(raw.id),
    )

    return {
      address: addressDomain,
      responsible,
    }
  }

  static toPrisma(
    responsible: Responsible,
    address: AddressResponsible,
  ): Prisma.UserUncheckedCreateInput & {
    address: Prisma.AddressUncheckedCreateInput
  } {
    return {
      id: responsible.id.toString(),
      name: responsible.name,
      email: responsible.email,
      password: responsible.password,
      document: responsible.document.value,
      phone: responsible.phone,
      addressId: address.id.toString(),
      address: {
        id: address.id.toString(),
        street: address.street,
        number: address.number,
        neighborhood: address.neighborhood,
        complement: address.complement,
        city: address.city,
        state: address.state,
      },
      isActive: responsible.isActive,
    }
  }
}
