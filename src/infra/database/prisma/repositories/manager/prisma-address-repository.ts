import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { AddressesRepository } from '@/domain/manager/application/repositories/address-repository'
import { Address } from '@/domain/manager/enterprise/entities/address'
import { PrismaAddressMapper } from '../../mappers/manager/prisma-address'

@Injectable()
export class PrismaAddressRepository implements AddressesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(address: Address): Promise<void> {
    const addressDomain = PrismaAddressMapper.toPrisma(address)

    await this.prisma.address.create({
      data: {
        ...addressDomain,
      },
    })
  }

  async save(address: Address): Promise<void> {
    const addressDomain = PrismaAddressMapper.toPrisma(address)

    await this.prisma.address.update({
      where: {
        id: addressDomain.id,
      },
      data: {
        ...addressDomain,
      },
    })
  }

  async findById(id: string): Promise<Address | null> {
    const address = await this.prisma.address.findFirst({
      where: {
        id,
      },
    })

    if (!address) {
      return null
    }

    return PrismaAddressMapper.toDomain(address)
  }
}
