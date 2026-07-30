import { describe, expect, it } from "vitest"
import { algorithmRegistry } from "@/lib/registry"
import { algorithms } from "@/data/algorithms"

// Algorithms without a runnable implementation (e.g. draft standards) have no
// registry entry by design; only test the ones LatticeForge actually implements.
const implementedAlgorithms = algorithms.filter((algorithm) => algorithm.id in algorithmRegistry)

describe.each(implementedAlgorithms)("algorithmRegistry $id", (algorithm) => {
  it("has a registry entry", () => {
    expect(algorithmRegistry[algorithm.id]).toBeDefined()
  })

  it("exposes the same operation names as declared in the catalog", () => {
    const definition = algorithmRegistry[algorithm.id]
    const operationNames = definition.operations.map((op) => op.name)
    expect(operationNames).toEqual(algorithm.operations)
  })

  it.each(algorithm.variants)("runs the first operation for variant $id without throwing", (variant) => {
    const keygen = algorithmRegistry[algorithm.id].operations[0]
    expect(() => keygen.run(variant.id, {})).not.toThrow()
  })
})
