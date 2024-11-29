import { InMemoryResponsibleRepository } from 'test/manager/application/repositories/in-memory-responsible-repository'
import { CreateResponsibleUseCase } from './create-responsible'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { InMemoryAddressRepository } from 'test/manager/application/repositories/in-memory-address-responsible-repository'

let responsibleRepository: InMemoryResponsibleRepository
let addressRepository: InMemoryAddressRepository
let fakeHasher: FakeHasher
let sut: CreateResponsibleUseCase

describe('Register Responsible', () => {
  beforeEach(() => {
    addressRepository = new InMemoryAddressRepository()
    responsibleRepository = new InMemoryResponsibleRepository(addressRepository)
    fakeHasher = new FakeHasher()
    sut = new CreateResponsibleUseCase(
      responsibleRepository,
      addressRepository,
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

    expect(addressRepository.items[0].street).toEqual('Rua das Flores')
  })
})
