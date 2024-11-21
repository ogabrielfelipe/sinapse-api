import { UseCaseError } from '@/core/errors/use-case-error'

export class ResponsibleAlreadyExistsError
  extends Error
  implements UseCaseError
{
  constructor(identifier: string) {
    super(`Responsible "${identifier}" already exists`)
  }
}
