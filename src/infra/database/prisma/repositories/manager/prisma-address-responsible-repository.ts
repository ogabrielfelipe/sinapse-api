import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { ResponsibleAddressesRepository } from '@/domain/manager/application/repositories/responsible/address-responsible-repository'
import { ResponsibleAddress } from '@/domain/manager/enterprise/entities/responsible-address'
import { PrismaAddressResponsibleMapper } from '../../mappers/manager/prisma-address-responsible'

@Injectable()
export class PrismaAddressResponsibleRepository
  implements ResponsibleAddressesRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async create(address: ResponsibleAddress): Promise<void> {
    const addressDomain = PrismaAddressResponsibleMapper.toPrisma(address)

    await this.prisma.address.create({
      data: {
        ...addressDomain,
      },
    })
  }

  async save(address: ResponsibleAddress): Promise<void> {
    const addressDomain = PrismaAddressResponsibleMapper.toPrisma(address)

    await this.prisma.address.update({
      where: {
        id: addressDomain.id,
      },
      data: {
        ...addressDomain,
      },
    })
  }

  async findByResponsibleId(
    responsibleId: string,
  ): Promise<ResponsibleAddress | null> {
    const address = await this.prisma.address.findFirst({
      where: {
        userId: responsibleId,
      },
    })

    if (!address) {
      return null
    }

    return PrismaAddressResponsibleMapper.toDomain(address)
  }

  async findById(id: string): Promise<ResponsibleAddress | null> {
    const address = await this.prisma.address.findFirst({
      where: {
        id,
      },
    })

    if (!address) {
      return null
    }

    return PrismaAddressResponsibleMapper.toDomain(address)
  }
}
