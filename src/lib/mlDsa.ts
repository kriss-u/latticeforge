import { ml_dsa44, ml_dsa65, ml_dsa87 } from "@noble/post-quantum/ml-dsa.js"
import { bytesToHex, hexToBytes, utf8ToBytes } from "@noble/hashes/utils.js"
import type { AlgorithmDefinition, OperationPayload } from "@/types/algorithm"

const variants = {
  "ml-dsa-44": ml_dsa44,
  "ml-dsa-65": ml_dsa65,
  "ml-dsa-87": ml_dsa87,
} as const

export type MlDsaVariantId = keyof typeof variants

function getVariant(variantId: string) {
  const dsa = variants[variantId as MlDsaVariantId]
  if (!dsa) throw new Error(`Unknown ML-DSA variant: ${variantId}`)
  return dsa
}

function keygen(variantId: string): string {
  const dsa = getVariant(variantId)
  const { publicKey, secretKey } = dsa.keygen()
  return JSON.stringify(
    {
      publicKey: bytesToHex(publicKey),
      secretKey: bytesToHex(secretKey),
    },
    null,
    2,
  )
}

function sign(variantId: string, payload: OperationPayload): string {
  const dsa = getVariant(variantId)
  const signature = dsa.sign(
    utf8ToBytes(payload.message ?? ""),
    hexToBytes(payload.secretKey ?? ""),
  )
  return JSON.stringify({ signature: bytesToHex(signature) }, null, 2)
}

function verify(variantId: string, payload: OperationPayload): string {
  const dsa = getVariant(variantId)
  const valid = dsa.verify(
    hexToBytes(payload.signature ?? ""),
    utf8ToBytes(payload.message ?? ""),
    hexToBytes(payload.publicKey ?? ""),
  )
  return valid
    ? "VALID\n\nSignature matches the message and public key."
    : "INVALID\n\nSignature does not match the message and public key."
}

export const mlDsaDefinition: AlgorithmDefinition = {
  operations: [
    {
      name: "Keygen",
      fields: [],
      run: (variantId) => keygen(variantId),
    },
    {
      name: "Sign",
      fields: [
        {
          key: "secretKey",
          label: "Secret key (hex)",
          type: "textarea",
          placeholder: "<hex secretKey from Keygen>",
        },
        {
          key: "message",
          label: "Message",
          type: "textarea",
          placeholder: "hello world",
        },
      ],
      run: (variantId, payload) => sign(variantId, payload),
    },
    {
      name: "Verify",
      fields: [
        {
          key: "publicKey",
          label: "Public key (hex)",
          type: "textarea",
          placeholder: "<hex publicKey from Keygen>",
        },
        {
          key: "message",
          label: "Message",
          type: "textarea",
          placeholder: "hello world",
        },
        {
          key: "signature",
          label: "Signature (hex)",
          type: "textarea",
          placeholder: "<hex signature from Sign>",
        },
      ],
      run: (variantId, payload) => verify(variantId, payload),
    },
  ],
}
