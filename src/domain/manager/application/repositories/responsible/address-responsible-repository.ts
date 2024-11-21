import { ResponsibleAddress } from '@/domain/manager/enterprise/entities/responsible-address'

export abstract class ResponsibleAddressesRepository {
  abstract create(address: ResponsibleAddress): Promise<void>
  abstract save(address: ResponsibleAddress): Promise<void>
  abstract findById(id: string): Promise<ResponsibleAddress | null>
  abstract findByResponsibleId(
    responsibleId: string,
  ): Promise<ResponsibleAddress | null>
}
