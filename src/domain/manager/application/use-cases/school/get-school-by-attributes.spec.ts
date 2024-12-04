import { InMemoryAddressRepository } from 'test/manager/application/repositories/in-memory-address-repository'
import { InMemorySchoolRepository } from 'test/manager/application/repositories/in-memory-school-repository'
import { GetSchoolByAttributesUseCase } from './get-school-by-attributes'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAddress } from 'test/factories/make-address'
import { makeSchool } from 'test/factories/make-school'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemorySchoolRepository: InMemorySchoolRepository
let inMemoryAddressRepository: InMemoryAddressRepository
let sut: GetSchoolByAttributesUseCase

describe('Get School', () => {
  inMemoryAddressRepository = new InMemoryAddressRepository()
  inMemorySchoolRepository = new InMemorySchoolRepository(
    inMemoryAddressRepository,
  )
  sut = new GetSchoolByAttributesUseCase(inMemorySchoolRepository)

  it('should be able to get school for attributes', async () => {
    const { address } = makeAddress(
      {
        street: 'street test',
        number: '123',
        neighborhood: 'Centro',
        complement: 'Apto 101',
        state: 'SP',
        city: 'São Paulo',
      },
      new UniqueEntityID('school-address-01'),
    )

    const { school } = makeSchool(
      {
        name: 'Company Test',
        email: 'company.test@example.com',
        addressId: address.id,
      },
      new UniqueEntityID('school-01'),
    )

    await inMemorySchoolRepository.create(school)
    await inMemoryAddressRepository.create(address)

    const result = await sut.execute({ email: 'company.test@example.com' })

    expect(result.isRight()).toEqual(true)

    if (result.value instanceof ResourceNotFoundError) {
      throw new Error('Expected a school, but got a ResourceNotFoundError')
    }

    expect(result.value[0].schoolId.toString()).toEqual('school-01')
  })
})
