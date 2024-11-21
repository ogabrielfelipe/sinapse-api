import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DocumentCPF } from '@/core/entities/value-object/document-cpf'
import { AddressResponsible } from '@/domain/manager/enterprise/entities/responsible-address'
import {
  Responsible,
  ResponsibleProps,
} from '@/domain/manager/enterprise/entities/responsible'
import { PrismaResponsibleMapper } from '@/infra/database/prisma/mappers/manager/prisma-responsible-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import * as dochelper from 'dochelper'

export function makeResponsible(
  override: Partial<ResponsibleProps> = {},
  id?: UniqueEntityID,
) {
  const document = DocumentCPF.crateWithoutValidation(dochelper.CPF.generate())

  const responsible = Responsible.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      document,
      phone: faker.phone.number(),
      isActive: true,
      ...override,
    },
    id,
  )

  return { responsible }
}
/*
@Injectable()
export class ResponsibleFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaResponsible(
    data: Partial<ResponsibleProps> = {},
  ): Promise<Responsible> {
    const { responsible } = makeResponsible(data)

    const result = PrismaResponsibleMapper.toPrisma(responsible)

    await this.prisma.user.create({
      data: {
        result.responsible,
      },
    })

    return responsible
  }
} */
