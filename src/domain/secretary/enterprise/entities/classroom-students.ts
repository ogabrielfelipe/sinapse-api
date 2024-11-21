import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ClassroomStudentsProps {
  classroomId: UniqueEntityID
  studentId: UniqueEntityID
}

export class ClassroomStudents extends Entity<ClassroomStudentsProps> {
  get classroomId() {
    return this.props.classroomId
  }

  get studentId() {
    return this.props.studentId
  }

  static create(props: ClassroomStudentsProps, id?: UniqueEntityID) {
    const classroomStudents = new ClassroomStudents(props, id)
    return classroomStudents
  }
}
