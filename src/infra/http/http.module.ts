import { Module } from '@nestjs/common'
import { CreateAccountController } from './controllers/responsible/create-account.controller'
import { RegisterResponsibleUseCase } from '@/domain/manager/application/use-cases/responsible/register-responsible'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [CreateAccountController],
  providers: [RegisterResponsibleUseCase],
})
export class HttpModule {}
