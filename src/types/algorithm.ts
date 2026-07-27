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
  type: "text" | "textarea" | "checkbox"
  placeholder?: string
  /** Field may be left empty; the algorithm falls back to a sensible default. */
  optional?: boolean
  /** Value is byte data (hex-encoded in the payload) and can be loaded from / saved to a file. */
  binary?: boolean
}

export type OperationPayload = Record<string, string>

export interface OperationResultField {
  key: string
  label: string
  /** Hex-encoded when `binary` is true, plain text otherwise. */
  value: string
  binary?: boolean
}

export interface OperationResult {
  /** Free-form text result, e.g. a VALID/INVALID verdict. */
  summary?: string
  fields?: OperationResultField[]
}

export interface OperationDef {
  name: string
  fields: FieldDef[]
  run: (variantId: string, payload: OperationPayload) => OperationResult
}

export interface AlgorithmDefinition {
  operations: OperationDef[]
}
