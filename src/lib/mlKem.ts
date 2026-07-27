import { ml_kem512, ml_kem768, ml_kem1024 } from "@noble/post-quantum/ml-kem.js"
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js"
import type { AlgorithmDefinition, OperationPayload } from "@/types/algorithm"

const variants = {
  "ml-kem-512": ml_kem512,
  "ml-kem-768": ml_kem768,
  "ml-kem-1024": ml_kem1024,
} as const

export type MlKemVariantId = keyof typeof variants

function getVariant(variantId: string) {
  const kem = variants[variantId as MlKemVariantId]
  if (!kem) throw new Error(`Unknown ML-KEM variant: ${variantId}`)
  return kem
}

function keygen(variantId: string): string {
  const kem = getVariant(variantId)
  const { publicKey, secretKey } = kem.keygen()
  return JSON.stringify(
    {
      publicKey: bytesToHex(publicKey),
      secretKey: bytesToHex(secretKey),
    },
    null,
    2,
  )
}

function encapsulate(variantId: string, payload: OperationPayload): string {
  const kem = getVariant(variantId)
  const { cipherText, sharedSecret } = kem.encapsulate(
    hexToBytes(payload.publicKey ?? ""),
  )
  return JSON.stringify(
    {
      cipherText: bytesToHex(cipherText),
      sharedSecret: bytesToHex(sharedSecret),
    },
    null,
    2,
  )
}

function decapsulate(variantId: string, payload: OperationPayload): string {
  const kem = getVariant(variantId)
  const sharedSecret = kem.decapsulate(
    hexToBytes(payload.cipherText ?? ""),
    hexToBytes(payload.secretKey ?? ""),
  )
  return JSON.stringify({ sharedSecret: bytesToHex(sharedSecret) }, null, 2)
}

export const mlKemDefinition: AlgorithmDefinition = {
  operations: [
    {
      name: "Keygen",
      fields: [],
      run: (variantId) => keygen(variantId),
    },
    {
      name: "Encapsulate",
      fields: [
        {
          key: "publicKey",
          label: "Public key (hex)",
          type: "textarea",
          placeholder: "<hex publicKey from Keygen>",
        },
      ],
      run: (variantId, payload) => encapsulate(variantId, payload),
    },
    {
      name: "Decapsulate",
      fields: [
        {
          key: "secretKey",
          label: "Secret key (hex)",
          type: "textarea",
          placeholder: "<hex secretKey from Keygen>",
        },
        {
          key: "cipherText",
          label: "Ciphertext (hex)",
          type: "textarea",
          placeholder: "<hex cipherText from Encapsulate>",
        },
      ],
      run: (variantId, payload) => decapsulate(variantId, payload),
    },
  ],
}
