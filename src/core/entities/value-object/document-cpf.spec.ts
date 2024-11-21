import { InvalidCPFError } from '@/core/errors/invalid-cpf'
import { DocumentCPF } from './document-cpf'

describe('DocumentCPF', () => {
  it('should not be able to create an invalid CPF', () => {
    expect(() => DocumentCPF.create('12345678912')).toThrow(InvalidCPFError)
  })

  it('should not be possible to create a CPF with fewer digits', () => {
    expect(() => DocumentCPF.create('1234567890')).toThrow(InvalidCPFError)
  })

  it('should be able to create a valid CPF', () => {
    const documentCPF = DocumentCPF.create('63558669061')
    expect(documentCPF).toEqual(expect.any(DocumentCPF))
  })
})
