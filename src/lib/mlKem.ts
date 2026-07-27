import { ml_kem512, ml_kem768, ml_kem1024 } from "@noble/post-quantum/ml-kem.js"
import { bytesToHex, hexToBytes } from "@noble/hashes/utils.js"
import type { AlgorithmDefinition, OperationPayload, OperationResult } from "@/types/algorithm"

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

function keygen(variantId: string, payload: OperationPayload): OperationResult {
  const kem = getVariant(variantId)
  const seed = payload.seed ? hexToBytes(payload.seed) : undefined
  const { publicKey, secretKey } = kem.keygen(seed)
  return {
    fields: [
      { key: "publicKey", label: "Public key", value: bytesToHex(publicKey), binary: true },
      { key: "secretKey", label: "Secret key", value: bytesToHex(secretKey), binary: true },
    ],
  }
}

function encapsulate(variantId: string, payload: OperationPayload): OperationResult {
  const kem = getVariant(variantId)
  const randomness = payload.randomness ? hexToBytes(payload.randomness) : undefined
  const { cipherText, sharedSecret } = kem.encapsulate(
    hexToBytes(payload.publicKey ?? ""),
    randomness,
  )
  return {
    fields: [
      { key: "cipherText", label: "Ciphertext", value: bytesToHex(cipherText), binary: true },
      { key: "sharedSecret", label: "Shared secret", value: bytesToHex(sharedSecret), binary: true },
    ],
  }
}

function decapsulate(variantId: string, payload: OperationPayload): OperationResult {
  const kem = getVariant(variantId)
  const sharedSecret = kem.decapsulate(
    hexToBytes(payload.cipherText ?? ""),
    hexToBytes(payload.secretKey ?? ""),
  )
  return {
    fields: [
      { key: "sharedSecret", label: "Shared secret", value: bytesToHex(sharedSecret), binary: true },
    ],
  }
}

export const mlKemDefinition: AlgorithmDefinition = {
  operations: [
    {
      name: "Keygen",
      fields: [
        {
          key: "seed",
          label: "Seed",
          type: "textarea",
          placeholder: "<optional hex seed for deterministic keygen>",
          optional: true,
          binary: true,
        },
      ],
      run: (variantId, payload) => keygen(variantId, payload),
    },
    {
      name: "Encapsulate",
      fields: [
        {
          key: "publicKey",
          label: "Public key (hex)",
          type: "textarea",
          placeholder: "<hex publicKey from Keygen>",
          binary: true,
        },
        {
          key: "randomness",
          label: "Randomness",
          type: "textarea",
          placeholder: "<optional 32-byte hex randomness for deterministic encapsulation>",
          optional: true,
          binary: true,
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
          binary: true,
        },
        {
          key: "cipherText",
          label: "Ciphertext (hex)",
          type: "textarea",
          placeholder: "<hex cipherText from Encapsulate>",
          binary: true,
        },
      ],
      run: (variantId, payload) => decapsulate(variantId, payload),
    },
  ],
}
