import { InMemoryResponsibleRepository } from 'test/manager/application/repositories/in-memory-responsible-repository'
import { RegisterResponsibleUseCase } from './register-responsible'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryAddressResponsibleRepository } from 'test/manager/application/repositories/in-memory-address-responsible-repository'

let responsibleRepository: InMemoryResponsibleRepository
let responsibleAddressRepository: InMemoryAddressResponsibleRepository
let fakeHasher: FakeHasher
let sut: RegisterResponsibleUseCase

describe('Register Responsible', () => {
  beforeEach(() => {
    responsibleAddressRepository = new InMemoryAddressResponsibleRepository()
    responsibleRepository = new InMemoryResponsibleRepository(
      responsibleAddressRepository,
    )
    fakeHasher = new FakeHasher()
    sut = new RegisterResponsibleUseCase(
      responsibleRepository,
      responsibleAddressRepository,
      fakeHasher,
    )
  })

  it('should be able to register a responsible', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      document: '63558669061',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '1234567890',
      address: {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        complement: 'Apto 101',
        state: 'SP',
        city: 'São Paulo',
      },
    })

    expect(result.isRight()).toBe(true)
    expect(responsibleRepository.items).toHaveLength(1)
    expect(responsibleRepository.items[0].name).toEqual('John Doe')

    expect(responsibleAddressRepository.items[0].street).toEqual(
      'Rua das Flores',
    )
  })
})
