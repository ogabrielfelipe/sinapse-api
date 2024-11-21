import { UseCaseError } from './use-case-error'

export class InvalidCPFError extends Error implements UseCaseError {
  private status: number

  constructor() {
    super('Invalid CPF')
    this.status = 400
  }

  get statusCode() {
    return this.status
  }
}
