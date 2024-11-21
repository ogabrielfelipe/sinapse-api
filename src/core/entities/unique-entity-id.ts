import { createId } from '@paralleldrive/cuid2'

export class UniqueEntityID {
  private value: string

  toString() {
    return this.value
  }

  toValue() {
    return this.value
  }

  constructor(value?: string) {
    this.value = value ?? createId()
  }

  equals(id: UniqueEntityID) {
    return id.toValue() === this.value
  }
}
