import { FakeEncrypter } from './../../../../../../test/cryptography/fake-encrypter'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryResponsibleRepository } from './../../../../../../test/manager/application/repositories/in-memory-responsible-repository'
import { AuthenticateResponsibleUseCase } from './authenticate-responsible'
import { makeResponsible } from 'test/factories/make-responsible'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { InMemoryAddressResponsibleRepository } from 'test/manager/application/repositories/in-memory-address-responsible-repository'

let inMemoryResponsibleRepository: InMemoryResponsibleRepository
let inMemoryAddressResponsibleRepository: InMemoryAddressResponsibleRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter
let sut: AuthenticateResponsibleUseCase

describe('Authenticate Responsible', () => {
  beforeEach(() => {
    inMemoryAddressResponsibleRepository =
      new InMemoryAddressResponsibleRepository()
    inMemoryResponsibleRepository = new InMemoryResponsibleRepository(
      inMemoryAddressResponsibleRepository,
    )
    fakeHasher = new FakeHasher()
    fakeEncrypter = new FakeEncrypter()

    sut = new AuthenticateResponsibleUseCase(
      inMemoryResponsibleRepository,
      fakeHasher,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a responsible', async () => {
    const { responsible } = makeResponsible({
      email: 'john.doe@mail.com',
      password: 'Password123-hashed',
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
