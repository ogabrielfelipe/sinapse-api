import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { ResponsiblesRepository } from '@/domain/manager/application/repositories/responsible/responsible-repository'
import { Responsible } from '@/domain/manager/enterprise/entities/responsible'
import { PrismaResponsibleMapper } from '../../mappers/manager/prisma-responsible-mapper'
import { GetResponsiblesByAttributesRequest } from '@/domain/manager/application/use-cases/responsible/get-responsibles-by-attributes'
import { ResponsibleDetails } from '@/domain/manager/application/use-cases/responsible/value-object/responsible-details'
import { PrismaResponsibleDetailsMapper } from '../../mappers/manager/prisma-responsible-details'

@Injectable()
export class PrismaResponsibleRepository implements ResponsiblesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(responsible: Responsible) {
    const data = PrismaResponsibleMapper.toPrisma(responsible)

    await this.prisma.user.create({
      data: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        document: data.document,
        phone: data.phone,
        role: 'RESPONSIBLE',
        isActive: true,
        changeLog: data.changeLog,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    })
  }

  async findByEmail(email: string): Promise<Responsible | null> {
    const responsible = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!responsible) {
      return null
    }

    return PrismaResponsibleMapper.toDomain(responsible)
  }

  async findById(id: string): Promise<Responsible | null> {
    const responsible = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        address: true,
      },
    })

    if (!responsible) {
      return null
    }

    if (!responsible.address) {
      return null
    }

    return PrismaResponsibleMapper.toDomain(responsible)
  }

  async save(responsible: Responsible) {
    const data = PrismaResponsibleMapper.toPrisma(responsible)

    await this.prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        email: data.email,
        document: data.document,
        phone: data.phone,
        isActive: data.isActive,
        changeLog: data.changeLog,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    })
  }

  async EditPassword(id: string, password: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id,
      },
      data: {
        password,
      },
    })
  }

  async findDetailsByAttributes(
    search: GetResponsiblesByAttributesRequest,
  ): Promise<ResponsibleDetails[] | null> {
    const responsibleDetails = await this.prisma.user.findMany({
      where: {
        ...(search.id && { id: search.id }),
        ...(search.name && { name: search.name }),
        ...(search.document && { document: search.document }),
        ...(search.phone && { phone: search.phone }),
        ...(search.email && { email: search.email }),
        role: 'RESPONSIBLE',
      },
      include: {
        address: true,
      },
    })

    if (!responsibleDetails.length) return null

    return responsibleDetails
      .filter((responsible) => responsible.address)
      .map((responsible) =>
        PrismaResponsibleDetailsMapper.toDomain(
          responsible,
          responsible.address[0],
        ),
      )
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: {
        id,
      },
    })
  }
}
