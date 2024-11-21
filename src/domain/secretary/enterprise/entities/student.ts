import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { Entity } from 'src/core/entities/entity'
import { ParentStudent } from './parent-student'
import { FieldLogs } from '@/core/types/fieldsLog'
import { DocumentCPF } from '@/core/entities/value-object/document-cpf'
import { InvalidCPFError } from '@/core/errors/invalid-cpf'

interface ChangeLogEntry {
  field: string
  oldValue: FieldLogs
  newValue: FieldLogs
  timestamp: Date
}

export interface StudentProps {
  schoolId: UniqueEntityID
  name: string
  email?: string | null
  phone: string
  document: DocumentCPF
  dateBirth: Date
  addressId?: UniqueEntityID | null
  isActive: boolean
  createdAt: Date
  updatedAt?: Date | null
  changeLog: ChangeLogEntry[]
  parents?: ParentStudent[] | null
}

export class Student extends Entity<StudentProps> {
  get schoolId() {
    return this.props.schoolId
  }

  set schoolId(schoolId: UniqueEntityID) {
    this.logChange('schoolId', this.props.schoolId, schoolId)
    this.props.schoolId = schoolId
    this.touch()
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.logChange('name', this.props.name, name)
    this.props.name = name
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

  get phone() {
    return this.props.phone
  }

  set phone(phone: string) {
    this.logChange('phone', this.props.phone, phone)
    this.props.phone = phone
    this.touch()
  }

  get document() {
    return this.props.document
  }

  set document(document: DocumentCPF) {
    this.logChange('document', this.props.document, document)
    this.props.document = document
    this.touch()
  }

  get dateBirth() {
    return this.props.dateBirth
  }

  set dateBirth(dateBirth: Date) {
    this.logChange('dateBirth', this.props.dateBirth, dateBirth)
    this.props.dateBirth = dateBirth
    this.touch()
  }

  get address() {
    return this.props.addressId
  }

  set address(address: UniqueEntityID) {
    this.logChange('address', this.props.addressId, address)
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
    props: Optional<StudentProps, 'updatedAt' | 'email' | 'parents'>,
    id?: UniqueEntityID,
  ) {
    const documentValidated = DocumentCPF.create(props.document.value)
    if (documentValidated instanceof InvalidCPFError) {
      return null
    }

    const student = new Student(
      {
        ...props,
        document: documentValidated,
        createdAt: props.createdAt ?? new Date(),
        changeLog: props.changeLog ?? [],
        parents: props.parents ?? null,
      },
      id,
    )
    return student
  }
}
