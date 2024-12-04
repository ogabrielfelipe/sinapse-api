import { InMemoryResponsibleRepository } from 'test/manager/application/repositories/in-memory-responsible-repository'
import { InMemoryAddressRepository } from 'test/manager/application/repositories/in-memory-address-repository'
import { InMemorySchoolRepository } from 'test/manager/application/repositories/in-memory-school-repository'
import { makeResponsible } from 'test/factories/make-responsible'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditSchoolUseCase } from './edit-school'
import { makeSchool } from 'test/factories/make-school'
import { makeAddress } from 'test/factories/make-address'
import { DocumentCNPJ } from '@/core/entities/value-object/document-cnpj'

let schoolRepository: InMemorySchoolRepository
let addressRepository: InMemoryAddressRepository
let responsibleRepository: InMemoryResponsibleRepository

let sut: EditSchoolUseCase

describe('Edit School', () => {
  beforeEach(() => {
    addressRepository = new InMemoryAddressRepository()
    schoolRepository = new InMemorySchoolRepository(addressRepository)
    responsibleRepository = new InMemoryResponsibleRepository(addressRepository)

    sut = new EditSchoolUseCase(
      schoolRepository,
      addressRepository,
      responsibleRepository,
    )
  })

  it('should be able to edit a school', async () => {
    const { responsible } = makeResponsible(
      {},
      new UniqueEntityID('responsible-01'),
    )

    const { address } = makeAddress(
      {
        street: 'Rua das Flores',
        number: '123',
        neighborhood: 'Centro',
        complement: 'Apto 101',
        state: 'SP',
        city: 'São Paulo',
      },
      new UniqueEntityID('address-01'),
    )

    const { school } = makeSchool(
      {
        name: 'School Test',
        shortName: 'School',
        document: DocumentCNPJ.crateWithoutValidation('68414694000147'),
        email: 'school.test@mail.com',
        isActive: true,
        addressId: address.id,
      },
      new UniqueEntityID('school-01'),
    )

    await responsibleRepository.create(responsible)
    await addressRepository.create(address)
    await schoolRepository.create(school)

    const result = await sut.execute({
      id: school.id.toString(),
      name: 'School Test Updated',
      shortName: 'School',
      document: '68414694000147',
      email: 'school.test@mail.com',
      isActive: true,
      address: {
        id: address.id.toString(),
        street: 'Rua das Flores Updated',
        number: '123',
        neighborhood: 'Centro',
        complement: 'Apto 101',
        state: 'SP',
        city: 'São Paulo',
      },
    })

    expect(result.isRight()).toBe(true)

    expect(responsibleRepository.items).toHaveLength(1)
    expect(schoolRepository.items[0].name).toEqual('School Test Updated')

    expect(addressRepository.items[0].street).toEqual('Rua das Flores Updated')
  })
})
