import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResponsiblesRepository } from '@/domain/manager/application/repositories/responsible/responsible-repository'
import { GetResponsiblesByAttributesRequest } from '@/domain/manager/application/use-cases/responsible/get-responsibles-by-attributes'
import { ResponsibleDetails } from '@/domain/manager/application/use-cases/responsible/value-object/responsible-details'
import { Responsible } from '@/domain/manager/enterprise/entities/responsible'
import { InMemoryAddressRepository } from './in-memory-address-repository'

export class InMemoryResponsibleRepository implements ResponsiblesRepository {
  public items: Responsible[] = []

  constructor(
    private responsibleAddressRepository: InMemoryAddressRepository,
  ) {}

  async create(responsible: Responsible) {
    this.items.push(responsible)
  }

  async save(responsible: Responsible): Promise<void> {
    const responsibleFounded =
      this.items.find((item) => item.id === responsible.id) || null

    if (responsibleFounded) {
      const index = this.items.findIndex(
        (item) => item.id === responsibleFounded.id,
      )

      responsibleFounded.name = responsible.name
      responsibleFounded.email = responsible.email
      responsibleFounded.addressId = responsible.addressId
      responsibleFounded.document = responsible.document
      responsibleFounded.isActive = responsible.isActive
      responsibleFounded.phone = responsible.phone

      this.items[index] = responsibleFounded
    }
  }

  async EditPassword(id: string, password: string) {
    const responsible = this.items.find((item) =>
      item.id.equals(new UniqueEntityID(id)),
    )

    const index = this.items.findIndex((item) =>
      item.id.equals(new UniqueEntityID(id)),
    )

    responsible.password = password

    this.items[index] = responsible
  }

  async delete(id: string) {
    const responsibles = this.items.filter((item) => item.id.toString() !== id)

    this.items = responsibles
  }

  async findByEmail(email: string): Promise<Responsible | null> {
    const responsible = this.items.find(
      (responsible) => responsible.email === email,
    )

    return responsible || null
  }

  async findById(id: string): Promise<Responsible | null> {
    const responsible =
      this.items.find((responsible) =>
        responsible.id.equals(new UniqueEntityID(id)),
      ) || null

    return responsible || null
  }

  async findDetailsByAttributes(
    search: GetResponsiblesByAttributesRequest,
  ): Promise<ResponsibleDetails[] | null> {
    const responsible = this.items.find((item) => {
      let match = true

      if (search.id && !item.id.equals(new UniqueEntityID(search.id))) {
        match = false
      }

      if (search.name && item.name !== search.name) {
        match = false
      }

      if (search.document && item.document.value !== search.document) {
        match = false
      }

      if (search.phone && item.phone !== search.phone) {
        match = false
      }

      if (search.email && item.email !== search.email) {
        match = false
      }

      return match
    })

    if (!responsible) return null

    const address = await this.responsibleAddressRepository.findById(
      responsible.addressId.toString(),
    )

    return [
      ResponsibleDetails.create({
        responsibleId: responsible.id,
        name: responsible.name,
        email: responsible.email,
        document: responsible.document,
        phone: responsible.phone,
        isActive: responsible.isActive,
        changeLog: responsible.changeLog,
        createdAt: responsible.createdAt,
        address: {
          addressId: address.id,
          changeLog: address.changeLog,
          street: address.street,
          number: address.number,
          neighborhood: address.neighborhood,
          complement: address.complement,
          state: address.state,
          city: address.city,
          createdAt: address.createdAt,
        },
      }),
    ]
  }
}
