import { Module } from '@nestjs/common'

import { Encrypter } from '@/core/application/cryptography/encrypter'
import { HashGenerator } from '@/core/application/cryptography/hash-generator'
import { HashComparer } from '@/core/application/cryptography/hash-comparer'

import { JwtEncrypter } from './jwt-encrypter'
import { BcryptHasher } from './bcrypt-hasher'

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BcryptHasher },
    { provide: HashGenerator, useClass: BcryptHasher },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
