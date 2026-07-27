import { beforeEach, describe, expect, it } from "vitest"
import { fnDsaDefinition } from "@/lib/fnDsa"
import { field } from "@/lib/testHelpers"

const [keygen, sign, verify] = fnDsaDefinition.operations

describe.each(["fn-dsa-512", "fn-dsa-1024"])("fnDsa %s", (variantId) => {
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
})

describe("fnDsa errors", () => {
  it("throws for an unknown variant", () => {
    expect(() => keygen.run("fn-dsa-99", {})).toThrow(/Unknown FN-DSA variant/)
  })
})
