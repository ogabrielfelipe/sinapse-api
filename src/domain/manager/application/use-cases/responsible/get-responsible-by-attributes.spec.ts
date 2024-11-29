import { InMemoryAddressRepository } from 'test/manager/application/repositories/in-memory-address-responsible-repository'
import { InMemoryResponsibleRepository } from 'test/manager/application/repositories/in-memory-responsible-repository'
import { GetResponsibleByAttributesUseCase } from './get-responsibles-by-attributes'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAddress } from 'test/factories/make-responsible-address'
import { DocumentCPF } from '@/core/entities/value-object/document-cpf'
import { makeResponsible } from 'test/factories/make-responsible'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryResponsibleRepository: InMemoryResponsibleRepository
let inMemoryAddressRepository: InMemoryAddressRepository
let sut: GetResponsibleByAttributesUseCase

describe('Get Responsible', () => {
  inMemoryAddressRepository = new InMemoryAddressRepository()
  inMemoryResponsibleRepository = new InMemoryResponsibleRepository(
    inMemoryAddressRepository,
  )
  sut = new GetResponsibleByAttributesUseCase(inMemoryResponsibleRepository)

  it('should be able to get responsible for attributes', async () => {
    const { responsibleAddress } = makeAddress(
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
        addressId: responsibleAddress.id,
        password: '123456',
        phone: '1234567890',
      },
      new UniqueEntityID('responsible-01'),
    )

    await inMemoryResponsibleRepository.create(responsible)
    await inMemoryAddressRepository.create(responsibleAddress)

    const result = await sut.execute({ id: 'responsible-01' })

    expect(result.isRight()).toEqual(true)

    if (result.value instanceof ResourceNotFoundError) {
      throw new Error('Expected a responsible, but got a ResourceNotFoundError')
    }

    expect(result.value[0].responsibleId.toString()).toEqual('responsible-01')
  })
})
