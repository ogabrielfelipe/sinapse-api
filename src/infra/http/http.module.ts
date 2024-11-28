import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { ResponsibleModule } from './controllers/responsible/responsible.module'
import { AuthenticationModule } from './controllers/authentication/authentication.module'

@Module({
  imports: [
    DatabaseModule,
    CryptographyModule,
    ResponsibleModule,
    AuthenticationModule,
  ],
  controllers: [],
  providers: [],
})
export class HttpModule {}
