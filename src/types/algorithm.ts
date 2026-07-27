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
