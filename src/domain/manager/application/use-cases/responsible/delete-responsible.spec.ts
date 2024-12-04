import { InMemoryResponsibleRepository } from './../../../../../../test/manager/application/repositories/in-memory-responsible-repository'
import { makeResponsible } from 'test/factories/make-responsible'
import { InMemoryAddressRepository } from 'test/manager/application/repositories/in-memory-address-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DeleteResponsibleUseCase } from './delete-responsible'
import { ResponsibleNotFoundError } from './errors/responsible-not-found'

let inMemoryResponsibleRepository: InMemoryResponsibleRepository
let inMemoryAddressRepository: InMemoryAddressRepository
let sut: DeleteResponsibleUseCase

describe('Delete Responsible', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryResponsibleRepository = new InMemoryResponsibleRepository(
      inMemoryAddressRepository,
    )
    sut = new DeleteResponsibleUseCase(inMemoryResponsibleRepository)
  })

  it('should be able to delete a responsible', async () => {
    const { responsible } = makeResponsible(
      {},
      new UniqueEntityID('responsible-01'),
    )

    await inMemoryResponsibleRepository.create(responsible)

    const result = await sut.execute({
      id: 'responsible-01',
    })

    expect(result.isRight()).toBe(true)

    const responsibleBeforeChange =
      await inMemoryResponsibleRepository.findById('responsible-01')

    expect(responsibleBeforeChange).toEqual(null)
  })

  it('should not be able to delete a responsible with id not found', async () => {
    const { responsible } = makeResponsible(
      {},
      new UniqueEntityID('responsible-01'),
    )

    await inMemoryResponsibleRepository.create(responsible)

    const result = await sut.execute({
      id: 'responsible-02-not-exists',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).instanceOf(ResponsibleNotFoundError)
  })
})
