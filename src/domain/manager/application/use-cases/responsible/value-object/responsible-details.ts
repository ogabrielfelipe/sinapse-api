import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DocumentCPF } from '@/core/entities/value-object/document-cpf'
import { DocumentCNPJ } from '@/core/entities/value-object/document-cnpj'
import { FieldLogs } from '@/core/types/fieldsLog'
import { ValueObject } from '@/core/entities/value-object'

interface ChangeLogEntry {
  field: string
  oldValue: FieldLogs
  newValue: FieldLogs
  timestamp: Date
}

interface ResponsibleAddress {
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

export interface ResponsibleDetailsProps {
  responsibleId: UniqueEntityID
  name: string
  document: DocumentCNPJ | DocumentCPF
  phone: string
  email: string
  isActive: boolean
  address: ResponsibleAddress
  createdAt: Date
  updatedAt?: Date | null
  changeLog: ChangeLogEntry[]
}

export class ResponsibleDetails extends ValueObject<ResponsibleDetailsProps> {
  get responsibleId() {
    return this.props.responsibleId
  }

  get name() {
    return this.props.name
  }

  get document() {
    return this.props.document
  }

  get phone() {
    return this.props.phone
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

  static create(props: ResponsibleDetailsProps) {
    return new ResponsibleDetails(props)
  }
}
