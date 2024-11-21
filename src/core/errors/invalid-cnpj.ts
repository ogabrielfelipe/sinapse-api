import { UseCaseError } from './use-case-error'

export class InvalidCNPJError extends Error implements UseCaseError {
  private status: number

  constructor() {
    super('Invalid CNPJ')
    this.status = 400
  }

  get statusCode() {
    return this.status
  }
}
