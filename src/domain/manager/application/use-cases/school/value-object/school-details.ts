import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DocumentCNPJ } from '@/core/entities/value-object/document-cnpj'
import { FieldLogs } from '@/core/types/fieldsLog'
import { ValueObject } from '@/core/entities/value-object'

interface ChangeLogEntry {
  field: string
  oldValue: FieldLogs
  newValue: FieldLogs
  timestamp: Date
}

interface SchoolAddress {
  addressId: UniqueEntityID
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
  schoolId: UniqueEntityID
  name: string
  shortName: string
  document: DocumentCNPJ
  email: string
  isActive: boolean
  address: SchoolAddress
  createdAt: Date
  updatedAt?: Date | null
  changeLog: ChangeLogEntry[]
}

export class SchoolDetails extends ValueObject<SchoolDetailsProps> {
  get schoolId() {
    return this.props.schoolId
  }

  get name() {
    return this.props.name
  }

  get shortName() {
    return this.props.shortName
  }

  get document() {
    return this.props.document
  }

  get email() {
    return this.props.email
  }

  get isActive() {
    return this.props.isActive
  }

  get address() {
    return this.props.address
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get changeLog() {
    return this.props.changeLog
  }

  static create(props: SchoolDetailsProps) {
    return new SchoolDetails(props)
  }
}
