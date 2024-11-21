import { DocumentCNPJ } from '@/core/entities/value-object/document-cnpj'
import { UniqueEntityID } from '../entities/unique-entity-id'
import { DocumentCPF } from '@/core/entities/value-object/document-cpf'

export type FieldLogs =
  | string
  | null
  | Date
  | boolean
  | number
  | UniqueEntityID
  | DocumentCNPJ
  | DocumentCPF
