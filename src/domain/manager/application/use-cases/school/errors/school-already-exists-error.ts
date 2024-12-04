import { UseCaseError } from '@/core/errors/use-case-error'

export class SchoolAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`School "${identifier}" already exists`)
  }
}
