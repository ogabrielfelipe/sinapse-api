import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Address,
  AddressProps,
} from '@/domain/manager/enterprise/entities/address'
import { PrismaAddressMapper } from '@/infra/database/prisma/mappers/manager/prisma-address'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { randomInt } from 'node:crypto'

export function makeAddress(
  override: Partial<AddressProps> = {},
  id?: UniqueEntityID,
) {
  const address = Address.create(
    {
      city: faker.location.city(),
      complement: faker.location.direction(),
      neighborhood: faker.location.county(),
      number: String(randomInt(10)),
      state: faker.location.country(),
      street: faker.location.street(),
      ...override,
    },
    id,
  )

  return { address }
}

@Injectable()
export class AddressFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAddress(data: Partial<AddressProps> = {}): Promise<Address> {
    const { address } = makeAddress(data)

    const addressMapper = PrismaAddressMapper.toPrisma(address)

    await this.prisma.address.create({
      data: {
        ...addressMapper,
      },
    })

    return address
  }
}
