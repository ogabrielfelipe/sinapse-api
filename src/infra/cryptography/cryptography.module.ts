import { Module } from '@nestjs/common'

import { JwtEncrypter } from './jwt-encrypter'
import { BcryptHasher } from './bcrypt-hasher'

import { Encrypter } from '@/core/application/cryptography/encrypter'
import { HashGenerator } from '@/core/application/cryptography/hash-generator'
import { HashComparer } from '@/core/application/cryptography/hash-comparer'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    JwtModule.register({
      // Adicione a configuração do JWT aqui
      secret: 'sua_chave_secreta', // Substitua por uma chave secreta real
      signOptions: { expiresIn: '1h' }, // Ajuste conforme necessário
    }),
  ],
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
    {
      provide: HashComparer,
      useClass: BcryptHasher,
    },
  ],
  exports: [Encrypter, HashGenerator, HashComparer],
})
export class CryptographyModule {}
