import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ResponsibleAddress,
  ResponsibleAddressProps,
} from '@/domain/manager/enterprise/entities/responsible-address'
import { PrismaAddressResponsibleMapper } from '@/infra/database/prisma/mappers/manager/prisma-address-responsible'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { randomInt } from 'node:crypto'

export function makeResponsibleAddress(
  override: Partial<ResponsibleAddressProps> = {},
  id?: UniqueEntityID,
) {
  const responsibleAddress = ResponsibleAddress.create(
    {
      city: faker.location.city(),
      complement: faker.location.direction(),
      neighborhood: faker.location.county(),
      number: String(randomInt(10)),
      state: faker.location.country(),
      street: faker.location.street(),
      responsibleId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return { responsibleAddress }
}

@Injectable()
export class ResponsibleAddressFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaResponsibleAddress(
    data: Partial<ResponsibleAddressProps> = {},
  ): Promise<ResponsibleAddress> {
    const { responsibleAddress } = makeResponsibleAddress(data)

    const address = PrismaAddressResponsibleMapper.toPrisma(responsibleAddress)

    await this.prisma.address.create({
      data: {
        ...address,
      },
    })

    return responsibleAddress
  }
}
