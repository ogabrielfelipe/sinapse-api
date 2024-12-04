import { School } from '@/domain/manager/enterprise/entities/school'
import { SchoolRepository } from '@/domain/manager/application/repositories/school/school-repository'
import { InMemoryAddressRepository } from './in-memory-address-repository'
import { GetSchoolByAttributesRequest } from '@/domain/manager/application/use-cases/school/get-school-by-attributes'
import { SchoolDetails } from '@/domain/manager/application/use-cases/school/value-object/school-details'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export class InMemorySchoolRepository implements SchoolRepository {
  public items: School[] = []

  constructor(private AddressRepository: InMemoryAddressRepository) {}

  async create(school: School): Promise<void> {
    this.items.push(school)
  }

  async save(school: School): Promise<void> {
    const schoolFounded =
      this.items.find((item) => item.id === school.id) || null

    if (schoolFounded) {
      const index = this.items.findIndex((item) => item.id === schoolFounded.id)

      schoolFounded.name = school.name
      schoolFounded.shortName = school.shortName
      schoolFounded.email = school.email
      schoolFounded.addressId = school.addressId
      schoolFounded.document = school.document
      schoolFounded.isActive = school.isActive

      this.items[index] = schoolFounded
    }
  }

  async findById(schoolId: string): Promise<School | null> {
    const school = this.items.find((school) =>
      school.id.equals(new UniqueEntityID(schoolId)),
    )

    return school || null
  }

  async findByDocument(document: string): Promise<School | null> {
    const school = this.items.find(
      (school) => school.document.value === document,
    )

    return school || null
  }

  async findDetailsByAttributes(
    search: GetSchoolByAttributesRequest,
  ): Promise<SchoolDetails[] | null> {
    const school = this.items.find((item) => {
      let match = true

      if (search.id && !item.id.equals(new UniqueEntityID(search.id))) {
        match = false
      }

      if (search.name && item.name !== search.name) {
        match = false
      }

      if (search.shortName && item.shortName !== search.shortName) {
        match = false
      }

      if (search.email && item.email !== search.email) {
        match = false
      }

      if (search.document && item.document.value !== search.document) {
        match = false
      }

      return match
    })

    if (!school) return null

    const address = await this.AddressRepository.findById(
      school.addressId.toString(),
    )

    return [
      SchoolDetails.create({
        schoolId: school.id,
        name: school.name,
        shortName: school.shortName,
        document: school.document,
        email: school.email,
        isActive: school.isActive,
        createdAt: school.createdAt,
        updatedAt: school.updatedAt,
        changeLog: school.changeLog,
        address: {
          addressId: address.id,
          street: address.street,
          number: address.number,
          neighborhood: address.neighborhood,
          complement: address.complement,
          state: address.state,
          city: address.city,
          createdAt: address.createdAt,
          updatedAt: address.updatedAt,
          changeLog: address.changeLog,
        },
      }),
    ]
  }

  async delete(schoolId: string): Promise<void> {
    const school = this.items.filter((item) => item.id.toString() !== schoolId)

    this.items = school
  }
}
