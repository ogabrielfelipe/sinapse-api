import { SchoolRepository } from '@/domain/manager/application/repositories/school/school-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { GetSchoolByAttributesRequest } from '@/domain/manager/application/use-cases/school/get-school-by-attributes'
import { SchoolDetails } from '@/domain/manager/application/use-cases/school/value-object/school-details'
import { School } from '@/domain/manager/enterprise/entities/school'
import { PrismaSchoolMapper } from '../../mappers/manager/prisma-school-mapper'
import { PrismaSchoolDetailsMapper } from '../../mappers/manager/prisma-school-details'

@Injectable()
export class PrismaSchoolRepository implements SchoolRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(school: School): Promise<void> {
    const data = PrismaSchoolMapper.toPrisma(school)
    await this.prisma.school.create({
      data,
    })
  }

  async save(school: School): Promise<void> {
    const data = PrismaSchoolMapper.toPrisma(school)

    await this.prisma.school.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async findById(schoolId: string): Promise<School | null> {
    const school = await this.prisma.school.findUnique({
      where: {
        id: schoolId,
      },
    })

    if (!school) {
      return null
    }

    return PrismaSchoolMapper.toDomain(school)
  }

  async findByDocument(document: string): Promise<School | null> {
    const school = await this.prisma.school.findUnique({
      where: {
        document,
      },
    })

    if (!school) {
      return null
    }

    return PrismaSchoolMapper.toDomain(school)
  }

  async findDetailsByAttributes(
    search: GetSchoolByAttributesRequest,
  ): Promise<SchoolDetails[] | null> {
    const where = {
      ...(search.id && { id: search.id }),
      ...(search.name && { name: search.name }),
      ...(search.shortName && { shortName: search.shortName }),
      ...(search.document && { document: search.document }),
      ...(search.email && { email: search.email }),
    }

    const schoolDetails = await this.prisma.school.findMany({
      where,
      include: {
        addresses: true,
      },
    })

    if (!schoolDetails.length) return null

    const responsibles = schoolDetails.map((school) => {
      return PrismaSchoolDetailsMapper.toDomain(school, school.addresses)
    })

    return responsibles
  }

  async delete(schoolId: string): Promise<void> {
    await this.prisma.school.delete({
      where: {
        id: schoolId,
      },
    })
  }
}
