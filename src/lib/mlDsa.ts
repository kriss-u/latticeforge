import { ml_dsa44, ml_dsa65, ml_dsa87 } from "@noble/post-quantum/ml-dsa.js"
import { bytesToHex, hexToBytes, utf8ToBytes } from "@noble/hashes/utils.js"

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

export function mlDsaKeygen(variantId: string): string {
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

export function mlDsaSign(variantId: string, input: string): string {
  const dsa = getVariant(variantId)
  const { secretKey, message } = JSON.parse(input) as {
    secretKey: string
    message: string
  }
  const signature = dsa.sign(utf8ToBytes(message), hexToBytes(secretKey))
  return JSON.stringify({ signature: bytesToHex(signature) }, null, 2)
}

export function mlDsaVerify(variantId: string, input: string): string {
  const dsa = getVariant(variantId)
  const { publicKey, message, signature } = JSON.parse(input) as {
    publicKey: string
    message: string
    signature: string
  }
  const valid = dsa.verify(
    hexToBytes(signature),
    utf8ToBytes(message),
    hexToBytes(publicKey),
  )
  return valid ? "VALID\n\nSignature matches the message and public key." : "INVALID\n\nSignature does not match the message and public key."
}

export const mlDsaPlaceholders: Record<string, string> = {
  Keygen: "Keygen ignores input. Press Run to generate a fresh keypair.",
  Sign: JSON.stringify(
    { secretKey: "<hex secretKey from Keygen>", message: "hello world" },
    null,
    2,
  ),
  Verify: JSON.stringify(
    {
      publicKey: "<hex publicKey from Keygen>",
      message: "hello world",
      signature: "<hex signature from Sign>",
    },
    null,
    2,
  ),
}
