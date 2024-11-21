import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  ResponsibleAddress,
  ResponsibleAddressProps,
} from '@/domain/manager/enterprise/entities/responsible-address'

import { faker } from '@faker-js/faker'

export function makeResponsibleAddress(
  override: Partial<ResponsibleAddressProps> = {},
  id?: UniqueEntityID,
) {
  const responsibleAddress = ResponsibleAddress.create(
    {
      city: faker.location.city(),
      complement: faker.location.direction(),
      neighborhood: faker.location.county(),
      number: faker.lorem.sentences(2),
      state: faker.location.country(),
      street: faker.location.street(),
      responsibleId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return { responsibleAddress }
}
