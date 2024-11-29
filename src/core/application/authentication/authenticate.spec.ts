import { FakeEncrypter } from '../../../../test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryResponsibleRepository } from '../../../../test/manager/application/repositories/in-memory-responsible-repository'
import { AuthenticateUseCase } from './authenticate'
import { makeResponsible } from 'test/factories/make-responsible'
import { WrongCredentialsError } from '../../../domain/manager/application/use-cases/responsible/errors/wrong-credentials-error'
import { InMemoryAddressRepository } from 'test/manager/application/repositories/in-memory-address-responsible-repository'
import { FakeComparer } from 'test/cryptography/fake-comparer'

let inMemoryResponsibleRepository: InMemoryResponsibleRepository
let inMemoryAddressRepository: InMemoryAddressRepository
let fakeHasher: FakeHasher
let fakeComparer: FakeComparer
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateUseCase

describe('Authenticate Responsible', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryResponsibleRepository = new InMemoryResponsibleRepository(
      inMemoryAddressRepository,
    )
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()
    fakeComparer = new FakeComparer()

    sut = new AuthenticateUseCase(
      inMemoryResponsibleRepository,
      fakeComparer,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a responsible', async () => {
    const passwordHashed = await fakeHasher.hash('Password123')

    const { responsible } = makeResponsible({
      email: 'john.doe@mail.com',
      password: passwordHashed,
    })

    await inMemoryResponsibleRepository.create(responsible)

    const result = await sut.execute({
      email: 'john.doe@mail.com',
      password: 'Password123',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })

  it('should not be able to authenticate a responsible with invalid credentials', async () => {
    const { responsible } = makeResponsible({
      email: 'john.doe@mail.com',
      password: 'Password123-hashed',
    })

    await inMemoryResponsibleRepository.create(responsible)

    const result = await sut.execute({
      email: 'john.doe@mail.com',
      password: 'Password',
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(WrongCredentialsError)
  })
})
