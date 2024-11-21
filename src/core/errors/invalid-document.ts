import { UseCaseError } from './use-case-error'

export class InvalidDocumentError extends Error implements UseCaseError {
  private status: number

  constructor() {
    super('Invalid Document')
    this.status = 400
  }

  get statusCode() {
    return this.status
  }
}
