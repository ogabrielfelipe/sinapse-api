import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ClassroomTeachersProps {
  classroomId: UniqueEntityID
  teacherId: UniqueEntityID
}

export class ClassroomTeachers extends Entity<ClassroomTeachersProps> {
  get classroomId() {
    return this.props.classroomId
  }

  get teacherId() {
    return this.props.teacherId
  }

  static create(props: ClassroomTeachersProps, id?: UniqueEntityID) {
    const classroomTeachers = new ClassroomTeachers(props, id)
    return classroomTeachers
  }
}
