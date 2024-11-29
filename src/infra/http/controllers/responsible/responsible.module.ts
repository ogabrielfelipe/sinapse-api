import { Module } from '@nestjs/common'
import { CreateResponsibleController } from './create-responsible.controller'
import { CreateResponsibleUseCase } from '@/domain/manager/application/use-cases/responsible/create-responsible'
import { DatabaseModule } from '@/infra/database/database.module'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { EditResponsibleController } from './edit-responsible.controller'
import { EditResponsibleUseCase } from '@/domain/manager/application/use-cases/responsible/edit-responsible'
import { ChangePasswordResponsibleController } from './change-password-responsible.controller'
import { ChangePasswordResponsibleUseCase } from '@/domain/manager/application/use-cases/responsible/change-password-responsible'
import { DeleteResponsibleController } from './delete-responsible.controller'
import { DeleteResponsibleUseCase } from '@/domain/manager/application/use-cases/responsible/delete-responsible'
import { GetResponsiblesController } from './get-responsibles.controller'
import { GetResponsibleByAttributesUseCase } from '@/domain/manager/application/use-cases/responsible/get-responsibles-by-attributes'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateResponsibleController,
    EditResponsibleController,
    ChangePasswordResponsibleController,
    DeleteResponsibleController,
    GetResponsiblesController,
  ],
  providers: [
    CreateResponsibleUseCase,
    EditResponsibleUseCase,
    ChangePasswordResponsibleUseCase,
    DeleteResponsibleUseCase,
    GetResponsibleByAttributesUseCase,
  ],
})
export class ResponsibleModule {}
