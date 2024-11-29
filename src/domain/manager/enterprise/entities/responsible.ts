import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FieldLogs } from '@/core/types/fieldsLog'
import { Optional } from '@/core/types/optional'
import { DocumentCNPJ } from '@/core/entities/value-object/document-cnpj'
import { DocumentCPF } from '@/core/entities/value-object/document-cpf'
import { InvalidCNPJError } from '@/core/errors/invalid-cnpj'
import { InvalidCPFError } from '@/core/errors/invalid-cpf'

interface ChangeLogEntry {
  field: string
  oldValue: FieldLogs
  newValue: FieldLogs
  timestamp: Date
}
export interface ResponsibleProps {
  name: string
  document: DocumentCNPJ | DocumentCPF
  phone: string
  email: string
  password: string
  isActive: boolean
  addressId: UniqueEntityID
  createdAt: Date
  updatedAt?: Date | null
  changeLog: ChangeLogEntry[]
}

export class Responsible extends Entity<ResponsibleProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.logChange('name', this.props.name, name)
    this.props.name = name
    this.touch()
  }

  get document() {
    return this.props.document
  }

  set document(document: DocumentCNPJ | DocumentCPF) {
    this.logChange('document', this.props.document.value, document.value)
    this.props.document = document
    this.touch()
  }

  get phone() {
    return this.props.phone
  }

  set phone(phone: string) {
    this.logChange('phone', this.props.phone, phone)
    this.props.phone = phone
    this.touch()
  }

  get email() {
    return this.props.email
  }

  set email(email: string) {
    this.logChange('email', this.props.email, email)
    this.props.email = email
    this.touch()
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
    this.touch()
  }

  get isActive() {
    return this.props.isActive
  }

  set isActive(isActive: boolean) {
    this.logChange('isActive', this.props.isActive, isActive)
    this.props.isActive = isActive
    this.touch()
  }

  get addressId() {
    return this.props.addressId
  }

  set addressId(addressId: UniqueEntityID) {
    this.logChange('addressId', this.props.addressId, addressId)
    this.props.addressId = addressId
    this.touch()
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

  private touch() {
    this.props.updatedAt = new Date()
  }

  private logChange(field: string, oldValue: FieldLogs, newValue: FieldLogs) {
    if (oldValue !== newValue) {
      const changeLogEntry: ChangeLogEntry = {
        field,
        oldValue,
        newValue,
        timestamp: new Date(),
      }
      this.props.changeLog.push(changeLogEntry)
    }
  }

  static create(
    props: Optional<ResponsibleProps, 'updatedAt' | 'changeLog' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    let documentIsCNPJ: boolean = false
    documentIsCNPJ = DocumentCNPJ.validate(props.document.value)

    let documentValidated:
      | DocumentCNPJ
      | DocumentCPF
      | InvalidCNPJError
      | InvalidCPFError = null

    if (documentIsCNPJ) {
      documentValidated = DocumentCNPJ.create(props.document.value)
    } else {
      documentValidated = DocumentCPF.create(props.document.value)
    }

    if (
      documentValidated instanceof InvalidCNPJError ||
      documentValidated instanceof InvalidCPFError
    ) {
      return null
    }

    const responsible = new Responsible(
      {
        ...props,
        document: documentValidated,
        createdAt: props.createdAt ?? new Date(),
        changeLog: props.changeLog ?? [],
      },
      id,
    )
    return responsible
  }
}
