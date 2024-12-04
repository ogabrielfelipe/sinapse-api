import { InMemoryResponsibleRepository } from 'test/manager/application/repositories/in-memory-responsible-repository'
import { InMemoryAddressRepository } from 'test/manager/application/repositories/in-memory-address-repository'
import { InMemorySchoolRepository } from 'test/manager/application/repositories/in-memory-school-repository'
import { CreateSchoolUseCase } from './create-school'
import { makeResponsible } from 'test/factories/make-responsible'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let schoolRepository: InMemorySchoolRepository
let addressRepository: InMemoryAddressRepository
let responsibleRepository: InMemoryResponsibleRepository

let sut: CreateSchoolUseCase

describe('Create School', () => {
  beforeEach(() => {
    addressRepository = new InMemoryAddressRepository()
    schoolRepository = new InMemorySchoolRepository(addressRepository)
    responsibleRepository = new InMemoryResponsibleRepository(addressRepository)

    sut = new CreateSchoolUseCase(
      schoolRepository,
      addressRepository,
      responsibleRepository,
    )
  })

  it('should be able to create a school', async () => {
    const { responsible } = makeResponsible(
      {},
      new UniqueEntityID('responsible-01'),
    )

    await responsibleRepository.create(responsible)

    const result = await sut.execute({
      name: 'School Test',
      shortName: 'School',
      document: '68414694000147',
      email: 'school.test@mail.com',
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
    expect(schoolRepository.items[0].name).toEqual('School Test')

    expect(addressRepository.items[0].street).toEqual('Rua das Flores')
  })
})
