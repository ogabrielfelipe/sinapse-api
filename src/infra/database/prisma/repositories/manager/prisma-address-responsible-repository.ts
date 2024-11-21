import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'
import { AddressResponsiblesRepository } from '@/domain/manager/application/repositories/responsible/address-responsible-repository'
import { AddressResponsible } from '@/domain/manager/enterprise/entities/responsible-address'

@Injectable()
export class PrismaAddressResponsibleRepository
  implements AddressResponsiblesRepository
{
  constructor(private readonly prisma: PrismaService) {}
  create(address: AddressResponsible): Promise<void> {
    throw new Error('Method not implemented.')
  }

  findById(id: string): Promise<AddressResponsible | null> {
    throw new Error('Method not implemented.')
  }
}
