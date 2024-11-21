import { InvalidCNPJError } from '@/core/errors/invalid-cnpj'
import { DocumentCNPJ } from './document-cnpj'

describe('DocumentCNPJ', () => {
  it('should not be able to create a invalid CNPJ', () => {
    expect(() => DocumentCNPJ.create('12345678901234')).toThrow(
      InvalidCNPJError,
    )
  })

  it('should not be able to create a CNPJ  with fewer digits', () => {
    expect(() => DocumentCNPJ.create('1234567890234')).toThrow(InvalidCNPJError)
  })

  it('should be able to create a valid CNPJ', () => {
    const documentCNPJ = DocumentCNPJ.create('49480749000172')
    expect(documentCNPJ).toEqual(expect.any(DocumentCNPJ))
  })
})
