import { HashGenerator } from '@/domain/manager/application/cryptography/hash-generator'

export class FakeHasher implements HashGenerator {
  async hash(plain: string) {
    return plain.concat('-hashed')
  }
}
