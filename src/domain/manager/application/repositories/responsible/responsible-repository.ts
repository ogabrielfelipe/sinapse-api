import { Responsible } from '@/domain/manager/enterprise/entities/responsible'
import { ResponsibleDetails } from '../../use-cases/responsible/value-object/responsible-details'
import { GetResponsiblesByAttributesRequest } from '../../use-cases/responsible/get-responsibles-by-attributes'

export abstract class ResponsiblesRepository {
  abstract create(responsible: Responsible): Promise<void>

  abstract save(Responsible: Responsible): Promise<void>

  abstract EditPassword(id: string, password: string): Promise<void>

  abstract findByEmail(email: string): Promise<Responsible | null>

  abstract findById(id: string): Promise<Responsible | null>

  abstract findDetailsByAttributes(
    search: GetResponsiblesByAttributesRequest,
  ): Promise<ResponsibleDetails | null>

  abstract delete(id: string): Promise<void>
}
