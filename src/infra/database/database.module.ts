import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { ResponsiblesRepository } from '@/domain/manager/application/repositories/responsible/responsible-repository'
import { PrismaResponsibleRepository } from './prisma/repositories/manager/prisma-responsible-repository'
import { ResponsibleAddressesRepository } from '@/domain/manager/application/repositories/responsible/address-responsible-repository'
import { PrismaAddressResponsibleRepository } from './prisma/repositories/manager/prisma-address-responsible-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: ResponsiblesRepository,
      useClass: PrismaResponsibleRepository,
    },
    {
      provide: ResponsibleAddressesRepository,
      useClass: PrismaAddressResponsibleRepository,
    },
  ],
  exports: [
    PrismaService,
    ResponsiblesRepository,
    ResponsibleAddressesRepository,
  ],
})
export class DatabaseModule {}
