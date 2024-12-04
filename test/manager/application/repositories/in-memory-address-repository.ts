import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AddressesRepository } from '@/domain/manager/application/repositories/address-repository'
import { Address } from '@/domain/manager/enterprise/entities/address'

export class InMemoryAddressRepository implements AddressesRepository {
  public items: Address[] = []

  async create(address: Address) {
    this.items.push(address)
  }

  async save(address: Address): Promise<void> {
    const addressFounded =
      this.items.find((item) => item.id.equals(address.id)) || null

    if (addressFounded) {
      const index = this.items.findIndex((item) =>
        item.id.equals(addressFounded.id),
      )

      addressFounded.city = address.city
      addressFounded.complement = address.complement
      addressFounded.neighborhood = address.neighborhood
      addressFounded.number = address.number
      addressFounded.state = address.state
      addressFounded.street = address.street

      this.items[index] = addressFounded
    }
  }

  async findById(id: string) {
    return (
      this.items.find((address) => address.id.equals(new UniqueEntityID(id))) ||
      null
    )
  }
}
