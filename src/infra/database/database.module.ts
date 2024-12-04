import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { ResponsiblesRepository } from '@/domain/manager/application/repositories/responsible/responsible-repository'
import { PrismaResponsibleRepository } from './prisma/repositories/manager/prisma-responsible-repository'
import { AddressesRepository } from '@/domain/manager/application/repositories/address-repository'
import { PrismaAddressRepository } from './prisma/repositories/manager/prisma-address-repository'
import { PrismaSchoolRepository } from './prisma/repositories/manager/prisma-school-repository'
import { SchoolRepository } from '@/domain/manager/application/repositories/school/school-repository'

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
    {
      provide: SchoolRepository,
      useClass: PrismaSchoolRepository,
    },
  ],
  exports: [
    PrismaService,
    ResponsiblesRepository,
    AddressesRepository,
    SchoolRepository,
  ],
})
export class DatabaseModule {}
