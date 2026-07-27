import { expect } from "vitest"
import type { OperationResult } from "@/types/algorithm"

export function field(result: OperationResult, key: string): string {
  const match = result.fields?.find((f) => f.key === key)
  expect(match, `expected result to contain field "${key}"`).toBeDefined()
  return match!.value
}
