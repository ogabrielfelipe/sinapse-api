import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResponsibleAddressesRepository } from '@/domain/manager/application/repositories/responsible/address-responsible-repository'
import { ResponsibleAddress } from '@/domain/manager/enterprise/entities/responsible-address'

export class InMemoryAddressResponsibleRepository
  implements ResponsibleAddressesRepository
{
  public items: ResponsibleAddress[] = []

  async create(address: ResponsibleAddress) {
    this.items.push(address)
  }

  async save(address: ResponsibleAddress): Promise<void> {
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

  async findByResponsibleId(
    responsibleId: string,
  ): Promise<ResponsibleAddress | null> {
    return (
      this.items.find((item) =>
        item.responsibleId.equals(new UniqueEntityID(responsibleId)),
      ) || null
    )
  }
}
