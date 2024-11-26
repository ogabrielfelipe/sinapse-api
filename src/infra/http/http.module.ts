import { Module } from '@nestjs/common'
import { CreateResponsibleController } from './controllers/responsible/create-responsible.controller'
import { RegisterResponsibleUseCase } from '@/domain/manager/application/use-cases/responsible/register-responsible'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { EditResponsibleController } from './controllers/responsible/edit-responsible.controller'
import { EditResponsibleUseCase } from '@/domain/manager/application/use-cases/responsible/edit-responsible'
import { ChangePasswordResponsibleController } from './controllers/responsible/change-password-responsible.controller'
import { ChangePasswordResponsibleUseCase } from '@/domain/manager/application/use-cases/responsible/change-password-responsible'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    CreateResponsibleController,
    EditResponsibleController,
    ChangePasswordResponsibleController,
  ],
  providers: [
    RegisterResponsibleUseCase,
    EditResponsibleUseCase,
    ChangePasswordResponsibleUseCase,
  ],
})
export class HttpModule {}
