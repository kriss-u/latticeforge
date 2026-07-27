import { beforeEach, describe, expect, it } from "vitest"
import { mlDsaDefinition } from "@/lib/mlDsa"
import { field } from "@/lib/testHelpers"

const [keygen, sign, verify] = mlDsaDefinition.operations

describe.each(["ml-dsa-44", "ml-dsa-65", "ml-dsa-87"])("mlDsa %s", (variantId) => {
  let publicKey: string
  let secretKey: string

  beforeEach(() => {
    const result = keygen.run(variantId, {})
    publicKey = field(result, "publicKey")
    secretKey = field(result, "secretKey")
  })

  it("verifies a signature over the signed message as VALID", () => {
    const signResult = sign.run(variantId, { secretKey, message: "hello world" })
    const signature = field(signResult, "signature")

    const { summary } = verify.run(variantId, { publicKey, message: "hello world", signature })
    expect(summary).toMatch(/^VALID/)
  })

  it("rejects a signature over a different message as INVALID", () => {
    const signResult = sign.run(variantId, { secretKey, message: "hello world" })
    const signature = field(signResult, "signature")

    const { summary } = verify.run(variantId, { publicKey, message: "goodbye world", signature })
    expect(summary).toMatch(/^INVALID/)
  })

  it("supports hex-encoded messages", () => {
    const message = "deadbeef"
    const signResult = sign.run(variantId, { secretKey, message, messageHex: "true" })
    const signature = field(signResult, "signature")

    const { summary } = verify.run(variantId, {
      publicKey,
      message,
      messageHex: "true",
      signature,
    })
    expect(summary).toMatch(/^VALID/)
  })

  it("rejects verification with a mismatched context", () => {
    const signResult = sign.run(variantId, { secretKey, message: "hello world", context: "aa" })
    const signature = field(signResult, "signature")

    const { summary } = verify.run(variantId, {
      publicKey,
      message: "hello world",
      signature,
      context: "bb",
    })
    expect(summary).toMatch(/^INVALID/)
  })

  it("verifies with a matching context", () => {
    const signResult = sign.run(variantId, { secretKey, message: "hello world", context: "aa" })
    const signature = field(signResult, "signature")

    const { summary } = verify.run(variantId, {
      publicKey,
      message: "hello world",
      signature,
      context: "aa",
    })
    expect(summary).toMatch(/^VALID/)
  })
})

describe("mlDsa errors", () => {
  it("throws for an unknown variant", () => {
    expect(() => keygen.run("ml-dsa-99", {})).toThrow(/Unknown ML-DSA variant/)
  })
})
