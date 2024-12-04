import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/infra/database/database.module'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { SessionController } from './session.controller'
import { AuthenticateUseCase } from '@/core/application/authentication/authenticate'
import { IdentifyController } from './identity.controller'
import { IdentifyUseCase } from '@/core/application/authentication/identify'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [SessionController, IdentifyController],
  providers: [AuthenticateUseCase, IdentifyUseCase],
})
export class AuthenticationModule {}
