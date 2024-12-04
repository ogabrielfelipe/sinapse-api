import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { CreateSchoolUseCase } from '@/domain/manager/application/use-cases/school/create-school'
import { CreateSchoolController } from './create-school.controller'
import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/infra/database/database.module'
import { EditSchoolController } from './edit-school.controller'
import { EditSchoolUseCase } from '@/domain/manager/application/use-cases/school/edit-school'
import { DeleteSchoolController } from './delete-school.controller'
import { DeleteSchoolUseCase } from '@/domain/manager/application/use-cases/school/delete-school'
import { GetSchoolsController } from './get-school.controller'
import { GetSchoolByAttributesUseCase } from '@/domain/manager/application/use-cases/school/get-school-by-attributes'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateSchoolController,
    EditSchoolController,
    DeleteSchoolController,
    GetSchoolsController,
  ],
  providers: [
    CreateSchoolUseCase,
    EditSchoolUseCase,
    DeleteSchoolUseCase,
    GetSchoolByAttributesUseCase,
  ],
})
export class SchoolModule {}
