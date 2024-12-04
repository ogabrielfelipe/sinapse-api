import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DocumentCNPJ } from '@/core/entities/value-object/document-cnpj'
import {
  School,
  SchoolProps,
} from '@/domain/manager/enterprise/entities/school'

import * as dochelper from 'dochelper'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { PrismaSchoolMapper } from '@/infra/database/prisma/mappers/manager/prisma-school-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeSchool(
  override: Partial<SchoolProps> = {},
  id?: UniqueEntityID,
) {
  const document = DocumentCNPJ.crateWithoutValidation(
    dochelper.CNPJ.generate(),
  )

  const school = School.create(
    {
      name: faker.company.name(),
      shortName: faker.company.buzzNoun(),
      addressId: new UniqueEntityID(),
      document,
      email: faker.internet.email(),
      isActive: true,
      ...override,
    },
    id,
  )

  return { school }
}

@Injectable()
export class SchoolFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaSchool(data: Partial<SchoolProps> = {}): Promise<School> {
    const { school } = makeSchool(data)

    const schoolMapper = PrismaSchoolMapper.toPrisma(school)

    await this.prisma.school.create({
      data: {
        ...schoolMapper,
      },
    })

    return school
  }
}
