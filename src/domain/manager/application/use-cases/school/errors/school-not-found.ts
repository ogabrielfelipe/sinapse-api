import { UseCaseError } from '@/core/errors/use-case-error'

export class SchoolNotFoundError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`School "${identifier}" not found.`)
  }
}
