import { ResponsibleDetails } from '@/domain/manager/application/use-cases/responsible/value-object/responsible-details'
import { FieldLogs } from '@/core/types/fieldsLog'

interface ChangeLogEntry {
  field: string
  oldValue: FieldLogs
  newValue: FieldLogs
  timestamp: Date
}

interface ResponsibleAddress {
  addressId: string
  responsibleId: string
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

export interface ResponsibleDetailsProps {
  responsibleId: string
  name: string
  document: string
  phone: string
  email: string
  isActive: boolean
  address: ResponsibleAddress
  createdAt: Date
  updatedAt?: Date | null
  changeLog: ChangeLogEntry[]
}

export class ResponsibleDetailsPresenter {
  static toHTTP(
    responsibleDetails: ResponsibleDetails,
  ): ResponsibleDetailsProps {
    return {
      responsibleId: responsibleDetails.responsibleId.toString(),
      name: responsibleDetails.name,
      document: responsibleDetails.document.value,
      phone: responsibleDetails.phone,
      email: responsibleDetails.email,
      isActive: responsibleDetails.isActive,
      address: {
        addressId: responsibleDetails.address.addressId.toString(),
        responsibleId: responsibleDetails.address.responsibleId.toString(),
        street: responsibleDetails.address.street,
        number: responsibleDetails.address.number,
        neighborhood: responsibleDetails.address.neighborhood,
        complement: responsibleDetails.address.complement,
        state: responsibleDetails.address.state,
        city: responsibleDetails.address.city,
        createdAt: responsibleDetails.address.createdAt,
        updatedAt: responsibleDetails.address.updatedAt,
        changeLog: responsibleDetails.address.changeLog,
      },
      createdAt: responsibleDetails.createdAt,
      updatedAt: responsibleDetails.updatedAt,
      changeLog: responsibleDetails.changeLog,
    }
  }
}
