import { DocumentCNPJ } from '../entities/value-object/document-cnpj'
import { DocumentCPF } from '../entities/value-object/document-cpf'

export function getDocumentType(document: string): 'CPF' | 'CNPJ' | null {
  if (DocumentCPF.validate(document)) {
    return 'CPF'
  } else if (DocumentCNPJ.validate(document)) {
    return 'CNPJ'
  } else {
    return null
  }
}
