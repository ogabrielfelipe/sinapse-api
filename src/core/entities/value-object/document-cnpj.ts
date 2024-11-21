import { InvalidCNPJError } from '@/core/errors/invalid-cnpj'

export class DocumentCNPJ {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static crateWithoutValidation(cnpj: string): DocumentCNPJ {
    return new DocumentCNPJ(cnpj)
  }

  /**
   * Creates a new DocumentCNPJ instance from a text input, validating the CNPJ.
   * @param cnpj The CNPJ string to validate and create an instance from.
   * @returns A new DocumentCNPJ instance if valid.
   * @throws {InvalidCNPJError} If the CNPJ is invalid.
   *
   * This method performs the following validations:
   * 1. Removes non-digit characters.
   * 2. Checks if the cleaned CNPJ has exactly 14 digits.
   * 3. Checks if all digits are not the same.
   * 4. Validates the CNPJ using the official algorithm.
   *
   * The CNPJ validation algorithm:
   * - Calculates two verification digits.
   * - For the first digit, uses weights 5,4,3,2,9,8,7,6,5,4,3,2 for the first 12 digits.
   * - For the second digit, uses weights 6,5,4,3,2,9,8,7,6,5,4,3,2 for the first 13 digits.
   * - Each digit is multiplied by its corresponding weight, summed, and then divided by 11.
   * - The remainder is subtracted from 11, and if the result is 10 or 11, the digit becomes 0.
   */
  static create(cnpj: string): DocumentCNPJ | InvalidCNPJError {
    if (this.validate(cnpj)) {
      return new DocumentCNPJ(cnpj)
    }
    throw new InvalidCNPJError()
  }

  static validate(cnpj: string): boolean {
    // Remove any non-digit characters
    const cleanCNPJ = cnpj.replace(/\D/g, '')

    // Check if it has 14 digits
    if (cleanCNPJ.length !== 14) {
      return false
    }

    // Check if all digits are the same
    if (/^(\d)\1+$/.test(cleanCNPJ)) {
      return false
    }

    // Validate CNPJ algorithm
    let sum = 0
    let weight = 2
    for (let i = 11; i >= 0; i--) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weight
      weight = weight === 9 ? 2 : weight + 1
    }
    let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (parseInt(cleanCNPJ.charAt(12)) !== digit) {
      return false
    }

    sum = 0
    weight = 2
    for (let i = 12; i >= 0; i--) {
      sum += parseInt(cleanCNPJ.charAt(i)) * weight
      weight = weight === 9 ? 2 : weight + 1
    }
    digit = sum % 11 < 2 ? 0 : 11 - (sum % 11)
    if (parseInt(cleanCNPJ.charAt(13)) !== digit) {
      return false
    }

    return true
  }
}
