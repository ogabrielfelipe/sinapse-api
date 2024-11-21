import { HashComparer } from '@/domain/manager/application/cryptography/hash-comparer'
import { HashGenerator } from '@/domain/manager/application/cryptography/hash-generator'

export class FakeHasher implements HashGenerator, HashComparer {
  async compare(plain: string, hash: string) {
    return plain === hash.split('-hashed')[0]
  }

  async hash(plain: string) {
    return plain.concat('-hashed')
  }
}
