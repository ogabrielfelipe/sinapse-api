import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FieldLogs } from '@/core/types/fieldsLog'
import { Optional } from '@/core/types/optional'
import { DocumentCNPJ } from '@/core/entities/value-object/document-cnpj'
import { InvalidCNPJError } from '@/core/errors/invalid-cnpj'

interface ChangeLogEntry {
  field: string
  oldValue: FieldLogs
  newValue: FieldLogs
  timestamp: Date
}

export interface SchoolProps {
  name: string
  shortName: string
  document: DocumentCNPJ
  responsibleId: UniqueEntityID
  addressId: UniqueEntityID
  isActive: boolean
  createdAt: Date
  updatedAt?: Date | null
  changeLog: ChangeLogEntry[]
}

export class School extends Entity<SchoolProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.logChange('name', this.props.name, name)
    this.props.name = name
    this.touch()
  }

  get shortName() {
    return this.props.shortName
  }

  set shortName(shortName: string) {
    this.logChange('shortName', this.props.shortName, shortName)
    this.props.shortName = shortName
    this.touch()
  }

  get document() {
    return this.props.document
  }

  set document(document: DocumentCNPJ) {
    this.logChange('document', this.props.document, document)
    this.props.document = document
    this.touch()
  }

  get responsibleId() {
    return this.props.responsibleId
  }

  set responsibleId(responsibleId: UniqueEntityID) {
    this.logChange('responsibleId', this.props.responsibleId, responsibleId)
    this.props.responsibleId = responsibleId
    this.touch()
  }

  get address() {
    return this.props.addressId
  }

  set address(address: UniqueEntityID) {
    this.logChange('addressId', this.props.addressId, address)
    this.props.addressId = address
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

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  private logChange(field: string, oldValue: FieldLogs, newValue: FieldLogs) {
    const changeLogEntry: ChangeLogEntry = {
      field,
      oldValue,
      newValue,
      timestamp: new Date(),
    }
    this.props.changeLog.push(changeLogEntry)
  }

  static create(
    props: Optional<SchoolProps, 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    const documentValidated = DocumentCNPJ.create(props.document.value)
    if (documentValidated instanceof InvalidCNPJError) {
      return null
    }

    const school = new School(
      {
        ...props,
        document: documentValidated,
        createdAt: props.createdAt ?? new Date(),
        changeLog: props.changeLog ?? [],
      },
      id,
    )
    return school
  }
}
