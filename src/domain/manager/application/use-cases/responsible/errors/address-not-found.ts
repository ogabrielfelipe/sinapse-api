import { UseCaseError } from '@/core/errors/use-case-error'

export class AddressNotFoundError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Address "${identifier}" not found.`)
  }
}
