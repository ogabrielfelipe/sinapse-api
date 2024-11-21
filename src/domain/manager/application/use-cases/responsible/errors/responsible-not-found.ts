import { UseCaseError } from '@/core/errors/use-case-error'

export class ResponsibleNotFoundError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Responsible "${identifier}" not found.`)
  }
}
