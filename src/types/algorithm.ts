export type AlgorithmCategory = "KEM" | "Signature" | "Hash-based Signature"

export interface AlgorithmVariant {
  id: string
  label: string
}

export interface Algorithm {
  id: string
  name: string
  codename: string
  fips: string
  category: AlgorithmCategory
  description: string
  variants: AlgorithmVariant[]
  operations: string[]
}

export interface FieldDef {
  key: string
  label: string
  type: "text" | "textarea"
  placeholder?: string
}

export type OperationPayload = Record<string, string>

export interface OperationDef {
  name: string
  fields: FieldDef[]
  run: (variantId: string, payload: OperationPayload) => string
}

export interface AlgorithmDefinition {
  operations: OperationDef[]
}
