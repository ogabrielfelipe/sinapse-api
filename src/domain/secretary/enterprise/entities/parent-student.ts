import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ParentStudentProps {
  parentId: UniqueEntityID
  studentId: UniqueEntityID
}

export class ParentStudent extends Entity<ParentStudentProps> {
  get parentId() {
    return this.props.parentId
  }

  get studentId() {
    return this.props.studentId
  }

  static create(props: ParentStudentProps, id?: UniqueEntityID) {
    const parentStudent = new ParentStudent(props, id)
    return parentStudent
  }
}
