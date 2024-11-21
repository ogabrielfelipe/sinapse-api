import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { AddressProps } from './address'
import { FieldLogs } from '@/core/types/fieldsLog'

interface ChangeLogEntry {
  field: string
  oldValue: FieldLogs
  newValue: FieldLogs
  timestamp: Date
}

export interface ResponsibleAddressProps extends AddressProps {
  responsibleId: UniqueEntityID
}

export class ResponsibleAddress extends Entity<ResponsibleAddressProps> {
  get responsibleId() {
    return this.props.responsibleId
  }

  get street() {
    return this.props.street
  }

  get number() {
    return this.props.number
  }

  get neighborhood() {
    return this.props.neighborhood
  }

  get complement() {
    return this.props.complement
  }

  get state() {
    return this.props.state
  }

  get city() {
    return this.props.city
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get changeLog(): ChangeLogEntry[] {
    return this.props.changeLog
  }

  set street(street: string) {
    this.logChange('street', this.props.street, street)
    this.props.street = street
    this.touch()
  }

  set number(number: string) {
    this.logChange('number', this.props.number, number)
    this.props.number = number
    this.touch()
  }

  set neighborhood(neighborhood: string) {
    this.logChange('neighborhood', this.props.neighborhood, neighborhood)
    this.props.neighborhood = neighborhood
    this.touch()
  }

  set complement(complement: string) {
    this.logChange('complement', this.props.complement, complement)
    this.props.complement = complement
    this.touch()
  }

  set state(state: string) {
    this.logChange('state', this.props.state, state)
    this.props.state = state
    this.touch()
  }

  set city(city: string) {
    this.logChange('city', this.props.city, city)
    this.props.city = city
    this.touch()
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
    props: Optional<
      ResponsibleAddressProps,
      'updatedAt' | 'changeLog' | 'createdAt'
    >,
    id?: UniqueEntityID,
  ) {
    const address = new ResponsibleAddress(
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
