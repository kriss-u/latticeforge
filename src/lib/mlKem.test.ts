import { beforeEach, describe, expect, it } from "vitest"
import { bytesToHex } from "@noble/hashes/utils.js"
import { mlKemDefinition } from "@/lib/mlKem"
import { field } from "@/lib/testHelpers"

const [keygen, encapsulate, decapsulate] = mlKemDefinition.operations

describe.each(["ml-kem-512", "ml-kem-768", "ml-kem-1024"])("mlKem %s", (variantId) => {
  let publicKey: string
  let secretKey: string

  beforeEach(() => {
    const result = keygen.run(variantId, {})
    publicKey = field(result, "publicKey")
    secretKey = field(result, "secretKey")
  })

  it("generates a hex-encoded keypair", () => {
    expect(publicKey).toMatch(/^[0-9a-f]+$/)
    expect(secretKey).toMatch(/^[0-9a-f]+$/)
  })

  it("decapsulates to the same shared secret that was encapsulated", () => {
    const encapResult = encapsulate.run(variantId, { publicKey })
    const cipherText = field(encapResult, "cipherText")
    const sharedSecret = field(encapResult, "sharedSecret")

    const decapResult = decapsulate.run(variantId, { cipherText, secretKey })
    expect(field(decapResult, "sharedSecret")).toBe(sharedSecret)
  })

  it("produces a deterministic keypair for a given seed", () => {
    const seed = bytesToHex(new Uint8Array(64).fill(7))
    const first = keygen.run(variantId, { seed })
    const second = keygen.run(variantId, { seed })
    expect(first.fields).toEqual(second.fields)
  })

  it("produces a deterministic shared secret for given randomness", () => {
    const randomness = bytesToHex(new Uint8Array(32).fill(3))
    const first = encapsulate.run(variantId, { publicKey, randomness })
    const second = encapsulate.run(variantId, { publicKey, randomness })
    expect(first.fields).toEqual(second.fields)
  })
})

describe("mlKem errors", () => {
  it("throws for an unknown variant", () => {
    expect(() => keygen.run("ml-kem-999", {})).toThrow(/Unknown ML-KEM variant/)
  })
})
