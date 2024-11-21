import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { ResponsiblesRepository } from '@/domain/manager/application/repositories/responsible/responsible-repository'
import { PrismaResponsibleRepository } from './prisma/repositories/manager/prisma-responsible-repository'
import { AddressResponsiblesRepository } from '@/domain/manager/application/repositories/responsible/address-responsible-repository'
import { PrismaAddressResponsibleRepository } from './prisma/repositories/manager/prisma-address-responsible-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: ResponsiblesRepository,
      useClass: PrismaResponsibleRepository,
    },
    {
      provide: AddressResponsiblesRepository,
      useClass: PrismaAddressResponsibleRepository,
    },
  ],
  exports: [
    PrismaService,
    ResponsiblesRepository,
    AddressResponsiblesRepository,
  ],
})
export class DatabaseModule {}
