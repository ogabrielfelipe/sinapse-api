import { Module } from '@nestjs/common'
import { DatabaseModule } from '@/infra/database/database.module'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { SessionController } from './session-controller'
import { AuthenticateUseCase } from '@/core/application/authentication/authenticate'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [SessionController],
  providers: [AuthenticateUseCase],
})
export class AuthenticationModule {}
