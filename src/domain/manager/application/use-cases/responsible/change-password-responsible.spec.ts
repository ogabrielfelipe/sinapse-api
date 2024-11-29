import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryResponsibleRepository } from './../../../../../../test/manager/application/repositories/in-memory-responsible-repository'
import { makeResponsible } from 'test/factories/make-responsible'
import { InMemoryAddressRepository } from 'test/manager/application/repositories/in-memory-address-responsible-repository'
import { ChangePasswordResponsibleUseCase } from './change-password-responsible'
import { FakeComparer } from 'test/cryptography/fake-comparer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PasswordAreSameError } from '@/core/errors/errors/password-are-same-error'

let inMemoryResponsibleRepository: InMemoryResponsibleRepository
let inMemoryAddressRepository: InMemoryAddressRepository
let fakeHasher: FakeHasher
let fakeComparer: FakeComparer
let sut: ChangePasswordResponsibleUseCase

describe('Change Password Responsible', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryResponsibleRepository = new InMemoryResponsibleRepository(
      inMemoryAddressRepository,
    )
    fakeHasher = new FakeHasher()
    fakeComparer = new FakeComparer()

    sut = new ChangePasswordResponsibleUseCase(
      inMemoryResponsibleRepository,
      fakeHasher,
      fakeComparer,
    )
  })

  it('should be able to change password of the a responsible', async () => {
    const passwordHashed = await fakeHasher.hash('Password123')

    const { responsible } = makeResponsible(
      {
        password: passwordHashed,
      },
      new UniqueEntityID('responsible-01'),
    )

    await inMemoryResponsibleRepository.create(responsible)

    const result = await sut.execute({
      id: 'responsible-01',
      password: 'Password123Change',
    })

    expect(result.isRight()).toBe(true)

    const responsibleBeforeChange =
      await inMemoryResponsibleRepository.findById('responsible-01')

    const passwordBeforeChangeHashed =
      await fakeHasher.hash('Password123Change')

    expect(responsibleBeforeChange.password).toEqual(passwordBeforeChangeHashed)
  })

  it('should not be able to change password of the a responsible with passwords are same', async () => {
    const passwordHashed = await fakeHasher.hash('Password123')

    const { responsible } = makeResponsible(
      {
        password: passwordHashed,
      },
      new UniqueEntityID('responsible-01'),
    )

    await inMemoryResponsibleRepository.create(responsible)

    const result = await sut.execute({
      id: 'responsible-01',
      password: 'Password123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).instanceOf(PasswordAreSameError)
  })
})
