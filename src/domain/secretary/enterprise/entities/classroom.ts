import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FieldLogs } from '@/core/types/fieldsLog'
import { Optional } from '@/core/types/optional'

interface ChangeLogEntry {
  field: string
  oldValue: FieldLogs
  newValue: FieldLogs
  timestamp: Date
}

export interface ClassroomProps {
  name: string
  description?: string | null
  maxStudents: number
  schoolId: UniqueEntityID
  isActive: boolean
  createdAt: Date
  updatedAt?: Date | null
  changeLog: ChangeLogEntry[]
}

export class Classroom extends Entity<ClassroomProps> {
  get name() {
    return this.props.name
  }

  set name(name: ClassroomProps['name']) {
    this.logChange('name', this.props.name, name)
    this.props.name = name
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: ClassroomProps['description']) {
    this.logChange('description', this.props.description, description)
    this.props.description = description
    this.touch()
  }

  get maxStudents() {
    return this.props.maxStudents
  }

  set maxStudents(maxStudents: ClassroomProps['maxStudents']) {
    this.logChange('maxStudents', this.props.maxStudents, maxStudents)
    this.props.maxStudents = maxStudents
    this.touch()
  }

  get schoolId() {
    return this.props.schoolId
  }

  set schoolId(schoolId: ClassroomProps['schoolId']) {
    this.logChange('schoolId', this.props.schoolId, schoolId)
    this.props.schoolId = schoolId
    this.touch()
  }

  get isActive() {
    return this.props.isActive
  }

  set isActive(isActive: ClassroomProps['isActive']) {
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
    props: Optional<ClassroomProps, 'description'>,
    id?: UniqueEntityID,
  ) {
    const parent = new Classroom(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        changeLog: props.changeLog ?? [],
      },
      id,
    )
    return parent
  }
}
