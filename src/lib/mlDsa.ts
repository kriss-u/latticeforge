import { ml_dsa44, ml_dsa65, ml_dsa87 } from "@noble/post-quantum/ml-dsa.js"
import { bytesToHex, hexToBytes, utf8ToBytes } from "@noble/hashes/utils.js"
import type { AlgorithmDefinition, OperationPayload, OperationResult } from "@/types/algorithm"

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

function messageBytes(payload: OperationPayload): Uint8Array {
  const message = payload.message ?? ""
  return payload.messageHex === "true" ? hexToBytes(message) : utf8ToBytes(message)
}

function keygen(variantId: string, payload: OperationPayload): OperationResult {
  const dsa = getVariant(variantId)
  const seed = payload.seed ? hexToBytes(payload.seed) : undefined
  const { publicKey, secretKey } = dsa.keygen(seed)
  return {
    fields: [
      { key: "publicKey", label: "Public key", value: bytesToHex(publicKey), binary: true },
      { key: "secretKey", label: "Secret key", value: bytesToHex(secretKey), binary: true },
    ],
  }
}

function sign(variantId: string, payload: OperationPayload): OperationResult {
  const dsa = getVariant(variantId)
  const signature = dsa.sign(messageBytes(payload), hexToBytes(payload.secretKey ?? ""), {
    context: payload.context ? hexToBytes(payload.context) : undefined,
    extraEntropy: payload.deterministic === "true" ? false : undefined,
  })
  return {
    fields: [{ key: "signature", label: "Signature", value: bytesToHex(signature), binary: true }],
  }
}

function verify(variantId: string, payload: OperationPayload): OperationResult {
  const dsa = getVariant(variantId)
  const valid = dsa.verify(
    hexToBytes(payload.signature ?? ""),
    messageBytes(payload),
    hexToBytes(payload.publicKey ?? ""),
    { context: payload.context ? hexToBytes(payload.context) : undefined },
  )
  return {
    summary: valid
      ? "VALID\n\nSignature matches the message and public key."
      : "INVALID\n\nSignature does not match the message and public key.",
  }
}

export const mlDsaDefinition: AlgorithmDefinition = {
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
      name: "Sign",
      fields: [
        {
          key: "secretKey",
          label: "Secret key (hex)",
          type: "textarea",
          placeholder: "<hex secretKey from Keygen>",
          binary: true,
        },
        {
          key: "message",
          label: "Message",
          type: "textarea",
          placeholder: "hello world",
          binary: true,
        },
        {
          key: "messageHex",
          label: "Message is hex-encoded bytes",
          type: "checkbox",
          optional: true,
        },
        {
          key: "context",
          label: "Context",
          type: "textarea",
          placeholder: "<optional hex context string, max 255 bytes>",
          optional: true,
          binary: true,
        },
        {
          key: "deterministic",
          label: "Deterministic signing (disable extra entropy)",
          type: "checkbox",
          optional: true,
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
          binary: true,
        },
        {
          key: "message",
          label: "Message",
          type: "textarea",
          placeholder: "hello world",
          binary: true,
        },
        {
          key: "messageHex",
          label: "Message is hex-encoded bytes",
          type: "checkbox",
          optional: true,
        },
        {
          key: "signature",
          label: "Signature (hex)",
          type: "textarea",
          placeholder: "<hex signature from Sign>",
          binary: true,
        },
        {
          key: "context",
          label: "Context",
          type: "textarea",
          placeholder: "<optional hex context string, max 255 bytes>",
          optional: true,
          binary: true,
        },
      ],
      run: (variantId, payload) => verify(variantId, payload),
    },
  ],
}
