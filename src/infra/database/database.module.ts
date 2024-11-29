import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { ResponsiblesRepository } from '@/domain/manager/application/repositories/responsible/responsible-repository'
import { PrismaResponsibleRepository } from './prisma/repositories/manager/prisma-responsible-repository'
import { AddressesRepository } from '@/domain/manager/application/repositories/responsible/address-repository'
import { PrismaAddressRepository } from './prisma/repositories/manager/prisma-address-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: ResponsiblesRepository,
      useClass: PrismaResponsibleRepository,
    },
    {
      provide: AddressesRepository,
      useClass: PrismaAddressRepository,
    },
  ],
  exports: [PrismaService, ResponsiblesRepository, AddressesRepository],
})
export class DatabaseModule {}
