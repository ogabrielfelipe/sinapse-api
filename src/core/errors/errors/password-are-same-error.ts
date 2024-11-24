import { UseCaseError } from '@/core/errors/use-case-error'

export class PasswordAreSameError extends Error implements UseCaseError {
  constructor() {
    super(`Password equal the one registered.`)
  }
}
