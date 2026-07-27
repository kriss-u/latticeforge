import { falcon512, falcon1024 } from "@noble/post-quantum/falcon.js"
import { bytesToHex, hexToBytes, utf8ToBytes } from "@noble/hashes/utils.js"
import type { AlgorithmDefinition, OperationPayload, OperationResult } from "@/types/algorithm"

const variants = {
  "fn-dsa-512": falcon512,
  "fn-dsa-1024": falcon1024,
} as const

export type FnDsaVariantId = keyof typeof variants

function getVariant(variantId: string) {
  const dsa = variants[variantId as FnDsaVariantId]
  if (!dsa) throw new Error(`Unknown FN-DSA variant: ${variantId}`)
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
  )
  return {
    summary: valid
      ? "VALID\n\nSignature matches the message and public key."
      : "INVALID\n\nSignature does not match the message and public key.",
  }
}

export const fnDsaDefinition: AlgorithmDefinition = {
  operations: [
    {
      name: "Keygen",
      fields: [
        {
          key: "seed",
          label: "Seed",
          type: "textarea",
          placeholder: "Optional 48-byte hex seed for deterministic keygen",
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
          placeholder: "Hex-encoded secret key",
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
          placeholder: "Hex-encoded public key",
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
          placeholder: "Hex-encoded signature",
          binary: true,
        },
      ],
      run: (variantId, payload) => verify(variantId, payload),
    },
  ],
}
