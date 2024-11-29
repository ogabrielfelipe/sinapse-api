import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { FieldLogs } from '@/core/types/fieldsLog'
import { Optional } from '@/core/types/optional'

export interface ChangeLogEntry {
  field: string
  oldValue: FieldLogs
  newValue: FieldLogs
  timestamp: Date
}

export interface AddressProps {
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

export class Address extends Entity<AddressProps> {
  get street() {
    return this.props.street
  }

  set street(street: string) {
    this.logChange('street', this.props.street, street)
    this.props.street = street
    this.touch()
  }

  get number() {
    return this.props.number
  }

  set number(number: string) {
    this.logChange('number', this.props.number, number)
    this.props.number = number
    this.touch()
  }

  get neighborhood() {
    return this.props.neighborhood
  }

  set neighborhood(neighborhood: string) {
    this.logChange('neighborhood', this.props.neighborhood, neighborhood)
    this.props.neighborhood = neighborhood
    this.touch()
  }

  get complement() {
    return this.props.complement
  }

  set complement(complement: string) {
    this.logChange('complement', this.props.complement, complement)
    this.props.complement = complement
    this.touch()
  }

  get state() {
    return this.props.state
  }

  set state(state: string) {
    this.logChange('state', this.props.state, state)
    this.props.state = state
    this.touch()
  }

  get city() {
    return this.props.city
  }

  set city(city: string) {
    this.logChange('city', this.props.city, city)
    this.props.city = city
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get changeLog() {
    return this.props.changeLog
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
    props: Optional<AddressProps, 'updatedAt' | 'changeLog' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const address = new Address(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        changeLog: props.changeLog ?? [],
      },
      id,
    )

    return address
  }
}
