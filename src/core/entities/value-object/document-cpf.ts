import { InvalidCPFError } from '@/core/errors/invalid-cpf'

export class DocumentCPF {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static crateWithoutValidation(cnpj: string): DocumentCPF {
    return new DocumentCPF(cnpj)
  }

  /**
   * Creates a new DocumentCPF instance from a text input, validating the CPF.
   * @param cpf The CPF string to validate and create an instance from.
   * @returns A new DocumentCPF instance if valid.
   * @throws {InvalidCPFError} If the CPF is invalid.
   *
   * This method performs the following validations:
   * 1. Removes non-digit characters.
   * 2. Checks if the cleaned CPF has exactly 11 digits.
   * 3. Checks if all digits are not the same.
   * 4. Validates the CPF using the official algorithm.
   */
  static create(cpf: string): DocumentCPF | InvalidCPFError {
    if (this.validate(cpf)) {
      return new DocumentCPF(cpf)
    }
    throw new InvalidCPFError()
  }

  static validate(cpf: string): boolean {
    // Remove any non-digit characters
    const cleanCPF = cpf.replace(/\D/g, '')

    // Check if it has 11 digits
    if (cleanCPF.length !== 11) {
      return false
    }

    // Check if all digits are the same
    if (/^(\d)\1+$/.test(cleanCPF)) {
      return false
    }

    // Validate CPF algorithm
    let sum = 0
    let remainder: number

    // First digit validation
    for (let i = 1; i <= 9; i++) {
      sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF.substring(9, 10))) {
      return false
    }

    // Second digit validation
    sum = 0
    for (let i = 1; i <= 10; i++) {
      sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== parseInt(cleanCPF.substring(10, 11))) {
      return false
    }
    return true
  }
}
