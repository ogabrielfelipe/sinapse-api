import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { ResponsiblesRepository } from '@/domain/manager/application/repositories/responsible/responsible-repository'
import { Responsible } from '@/domain/manager/enterprise/entities/responsible'
import { PrismaResponsibleMapper } from '../../mappers/manager/prisma-responsible-mapper'
import { AddressResponsible } from '@/domain/manager/enterprise/entities/responsible-address'

@Injectable()
export class PrismaResponsibleRepository implements ResponsiblesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(responsible: Responsible, address: AddressResponsible) {
    const data = PrismaResponsibleMapper.toPrisma(responsible, address)

    await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        document: data.document,
        phone: data.phone,
        role: 'RESPONSIBLE',
        isActive: true,
        address: {
          create: {
            ...data.address,
          },
        },
      },
    })
  }

  async findByEmail(email: string): Promise<{
    responsible: Responsible
    address?: AddressResponsible | null
  } | null> {
    const responsible = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!responsible) {
      return null
    }

    return PrismaResponsibleMapper.toDomain({ ...responsible, address: null })
  }

  async findById(id: string): Promise<{
    responsible: Responsible
    address: AddressResponsible
  } | null> {
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

    return PrismaResponsibleMapper.toDomain({
      ...responsible,
      address: responsible.address,
    })
  }
}
