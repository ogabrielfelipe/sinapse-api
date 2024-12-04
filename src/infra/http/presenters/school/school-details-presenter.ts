import { SchoolDetails } from '@/domain/manager/application/use-cases/school/value-object/school-details'
import { FieldLogs } from '@/core/types/fieldsLog'

interface ChangeLogEntry {
  field: string
  oldValue: FieldLogs
  newValue: FieldLogs
  timestamp: Date
}

interface SchoolAddress {
  addressId: string
  street: string
  number: string
  neighborhood: string
  complement: string
  state: string
  city: string
  createdAt: Date
  updatedAt?: Date | null
  changeLog: ChangeLogEntry[]
}

export interface SchoolDetailsProps {
  schoolId: string
  name: string
  shortName: string
  document: string
  email: string
  isActive: boolean
  address: SchoolAddress
  createdAt: Date
  updatedAt?: Date | null
  changeLog: ChangeLogEntry[]
}

export class SchoolDetailsPresenter {
  static toHTTP(schoolDetails: SchoolDetails): SchoolDetailsProps {
    return {
      schoolId: schoolDetails.schoolId.toString(),
      name: schoolDetails.name,
      document: schoolDetails.document.value,
      shortName: schoolDetails.shortName,
      email: schoolDetails.email,
      isActive: schoolDetails.isActive,
      address: {
        addressId: schoolDetails.address.addressId.toString(),
        street: schoolDetails.address.street,
        number: schoolDetails.address.number,
        neighborhood: schoolDetails.address.neighborhood,
        complement: schoolDetails.address.complement,
        state: schoolDetails.address.state,
        city: schoolDetails.address.city,
        createdAt: schoolDetails.address.createdAt,
        updatedAt: schoolDetails.address.updatedAt,
        changeLog: schoolDetails.address.changeLog,
      },
      createdAt: schoolDetails.createdAt,
      updatedAt: schoolDetails.updatedAt,
      changeLog: schoolDetails.changeLog,
    }
  }
}
