import { InMemoryResponsibleRepository } from '../../../../test/manager/application/repositories/in-memory-responsible-repository'
import { makeResponsible } from 'test/factories/make-responsible'
import { InMemoryAddressRepository } from 'test/manager/application/repositories/in-memory-address-repository'
import { IdentifyUseCase } from './identify'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryResponsibleRepository: InMemoryResponsibleRepository
let inMemoryAddressRepository: InMemoryAddressRepository
let sut: IdentifyUseCase

describe('Authenticate Responsible', () => {
  beforeEach(() => {
    inMemoryAddressRepository = new InMemoryAddressRepository()
    inMemoryResponsibleRepository = new InMemoryResponsibleRepository(
      inMemoryAddressRepository,
    )

    sut = new IdentifyUseCase(inMemoryResponsibleRepository)
  })

  it('should be able to authenticate a responsible', async () => {
    const { responsible } = makeResponsible({
      email: 'john.doe@mail.com',
      password: 'Password123',
    })

    await inMemoryResponsibleRepository.create(responsible)

    const result = await sut.execute({
      id: responsible.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      id: expect.any(String),
      name: expect.any(String),
      email: expect.any(String),
      roles: expect.any(Array),
    })
  })

  it('should not be able to authenticate a responsible with invalid credentials', async () => {
    const { responsible } = makeResponsible({
      email: 'john.doe@mail.com',
      password: 'Password123-hashed',
    })

    await inMemoryResponsibleRepository.create(responsible)

    const result = await sut.execute({
      id: 'teste',
    })

    expect(result.isRight()).toBe(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
