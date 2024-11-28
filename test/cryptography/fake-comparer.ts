import { HashComparer } from '@/core/application/cryptography/hash-comparer'

export class FakeComparer implements HashComparer {
  async compare(plain: string, hash: string) {
    return plain === hash.split('-hashed')[0]
  }
}
