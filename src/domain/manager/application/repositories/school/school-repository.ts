import { School } from '@/domain/manager/enterprise/entities/school'
import { GetSchoolByAttributesRequest } from '../../use-cases/school/get-school-by-attributes'
import { SchoolDetails } from '../../use-cases/school/value-object/school-details'

export abstract class SchoolRepository {
  abstract create(school: School): Promise<void>
  abstract save(school: School): Promise<void>
  abstract findById(schoolId: string): Promise<School | null>
  abstract findByDocument(document: string): Promise<School | null>
  abstract findDetailsByAttributes(
    search: GetSchoolByAttributesRequest,
  ): Promise<SchoolDetails[] | null>

  abstract delete(schoolId: string): Promise<void>
}
