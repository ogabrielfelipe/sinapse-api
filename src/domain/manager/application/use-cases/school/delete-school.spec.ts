import { InMemorySchoolRepository } from './../../../../../../test/manager/application/repositories/in-memory-school-repository'
import { makeSchool } from 'test/factories/make-school'
import { InMemoryAddressRepository } from 'test/manager/application/repositories/in-memory-address-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteSchoolUseCase } from './delete-school'
import { SchoolNotFoundError } from './errors/school-not-found'

let inMemorySchoolRepository: InMemorySchoolRepository
let inMemoryAddressRepository: InMemoryAddressRepository
let sut: DeleteSchoolUseCase

describe('Delete School', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemorySchoolRepository = new InMemorySchoolRepository(
      inMemoryAddressRepository,
    )
    sut = new DeleteSchoolUseCase(inMemorySchoolRepository)
  })

  it('should be able to delete a school', async () => {
    const { school } = makeSchool({}, new UniqueEntityID('school-01'))

    await inMemorySchoolRepository.create(school)

    const result = await sut.execute({
      id: 'school-01',
    })

    expect(result.isRight()).toBe(true)

    const schoolBeforeChange =
      await inMemorySchoolRepository.findById('school-01')

    expect(schoolBeforeChange).toEqual(null)
  })

  it('should not be able to delete a school with id not found', async () => {
    const { school } = makeSchool({}, new UniqueEntityID('school-01'))

    await inMemorySchoolRepository.create(school)

    const result = await sut.execute({
      id: 'school-02-not-exists',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).instanceOf(SchoolNotFoundError)
  })
})
