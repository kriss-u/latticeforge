import { fnDsaDefinition } from "@/lib/fnDsa"
import { mlDsaDefinition } from "@/lib/mlDsa"
import { mlKemDefinition } from "@/lib/mlKem"
import { slhDsaDefinition } from "@/lib/slhDsa"
import type { AlgorithmDefinition } from "@/types/algorithm"

export const algorithmRegistry: Record<string, AlgorithmDefinition> = {
  "ml-kem": mlKemDefinition,
  "ml-dsa": mlDsaDefinition,
  "fn-dsa": fnDsaDefinition,
  "slh-dsa": slhDsaDefinition,
}
