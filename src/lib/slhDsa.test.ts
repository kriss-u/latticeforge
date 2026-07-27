import { beforeEach, describe, expect, it } from "vitest"
import { slhDsaDefinition } from "@/lib/slhDsa"
import { field } from "@/lib/testHelpers"

const [keygen, sign, verify] = slhDsaDefinition.operations

describe.each(["slh-dsa-128s", "slh-dsa-192s", "slh-dsa-256s"])("slhDsa %s", (variantId) => {
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
})

describe("slhDsa errors", () => {
  it("throws for an unknown variant", () => {
    expect(() => keygen.run("slh-dsa-99", {})).toThrow(/Unknown SLH-DSA variant/)
  })
})
