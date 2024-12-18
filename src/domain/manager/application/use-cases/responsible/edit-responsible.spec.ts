import { InMemoryResponsibleRepository } from 'test/manager/application/repositories/in-memory-responsible-repository'

import { makeResponsible } from 'test/factories/make-responsible'
import { EditResponsibleUseCase } from './edit-responsible'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DocumentCPF } from '@/core/entities/value-object/document-cpf'
import { InMemoryAddressRepository } from 'test/manager/application/repositories/in-memory-address-repository'
import { makeAddress } from 'test/factories/make-address'

let inMemoryResponsibleRepository: InMemoryResponsibleRepository
let inMemoryAddressRepository: InMemoryAddressRepository
let sut: EditResponsibleUseCase

describe('Edit Responsible', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryResponsibleRepository = new InMemoryResponsibleRepository(
      inMemoryAddressRepository,
    )
    sut = new EditResponsibleUseCase(
      inMemoryResponsibleRepository,
      inMemoryAddressRepository,
    )
  })

  it('should be able to edit a responsible', async () => {
    const { address } = makeAddress(
      {
        street: 'street test',
        number: '123',
        neighborhood: 'Centro',
        complement: 'Apto 101',
        state: 'SP',
        city: 'São Paulo',
      },
      new UniqueEntityID('responsible-address-01'),
    )

    const { responsible } = makeResponsible(
      {
        name: 'John Doe',
        document: DocumentCPF.crateWithoutValidation('63558669061'),
        email: 'john.doe@example.com',
        addressId: address.id,
        password: '123456',
        phone: '1234567890',
      },
      new UniqueEntityID('responsible-01'),
    )

    await inMemoryResponsibleRepository.create(responsible)

    expect(inMemoryResponsibleRepository.items[0].name).toEqual('John Doe')

    await inMemoryAddressRepository.create(address)

    expect(inMemoryAddressRepository.items[0].street).toEqual('street test')

    const result = await sut.execute({
      responsible: {
        id: 'responsible-01',
        name: 'John Doe Updated',
        document: '63558669061',
        email: 'john.doe.updated@example.com',
        phone: '1234567890',
        isActive: true,
      },
      address: {
        id: 'responsible-address-01',
        street: 'street test Updated',
        number: '123',
        neighborhood: 'Centro',
        complement: 'Apto 101',
        state: 'SP',
        city: 'São Paulo',
      },
    })

    const responsibleAfterEdit = inMemoryResponsibleRepository.items.find(
      (item) => item.id.equals(new UniqueEntityID('responsible-01')),
    )

    expect(result.isRight()).toBe(true)
    expect(responsibleAfterEdit.name).toEqual('John Doe Updated')

    const responsibleAddressAfterEdit = inMemoryAddressRepository.items.find(
      (item) => item.id.equals(new UniqueEntityID('responsible-address-01')),
    )

    expect(result.isRight()).toBe(true)
    expect(responsibleAddressAfterEdit.street).toEqual('street test Updated')
  })
})
