import { useState } from "react"
import { Box, Grid, GridItem, type BoxProps } from "@chakra-ui/react"
import AlgorithmSidebar from "@/components/tool/AlgorithmSidebar"
import ConfigPanel from "@/components/tool/ConfigPanel"
import OutputPanel from "@/components/tool/OutputPanel"
import { algorithms } from "@/data/algorithms"
import { algorithmRegistry } from "@/lib/registry"
import type { Algorithm, OperationPayload, OperationResult } from "@/types/algorithm"

/** Minimum visible duration for the Run loading state, so fast ops still register as feedback. */
const MIN_RUN_DURATION_MS = 400

const glassPanel: BoxProps = {
  bg: { base: "whiteAlpha.600", _dark: "whiteAlpha.50" },
  backdropFilter: "blur(24px) saturate(160%)",
  borderWidth: "1px",
  borderColor: { base: "whiteAlpha.700", _dark: "whiteAlpha.100" },
  rounded: "xl",
  boxShadow: {
    base: "0 4px 24px -4px rgba(18, 67, 66, 0.08), inset 0 1px 0 rgba(255,255,255,0.5)",
    _dark: "0 4px 24px -4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
  },
  overflow: "hidden",
}

export default function Home() {
  const [algorithm, setAlgorithm] = useState<Algorithm>(algorithms[0])
  const [variantId, setVariantId] = useState(algorithms[0].variants[0].id)
  const [operation, setOperation] = useState(algorithms[0].operations[0])
  const [payload, setPayload] = useState<OperationPayload>({})
  const [result, setResult] = useState<OperationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const handleSelectAlgorithm = (next: Algorithm) => {
    setAlgorithm(next)
    setVariantId(next.variants[0].id)
    setOperation(next.operations[0])
    setPayload({})
    setResult(null)
    setError(null)
  }

  const handleOperationChange = (next: string) => {
    setOperation(next)
    setPayload({})
  }

  const handlePayloadChange = (key: string, value: string) => {
    setPayload((prev) => ({ ...prev, [key]: value }))
  }

  const handleRun = () => {
    setIsRunning(true)
    const startedAt = performance.now()

    // Let the loading overlay paint before running the (synchronous) crypto op.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const operationDef = algorithmRegistry[algorithm.id]?.operations.find(
          (op) => op.name === operation,
        )

        let nextResult: OperationResult | null = null
        let nextError: string | null = null

        if (!operationDef) {
          nextError = `Output not yet implemented for ${operation}.`
        } else {
          try {
            nextResult = operationDef.run(variantId, payload)
          } catch (err) {
            nextError = err instanceof Error ? err.message : String(err)
          }
        }

        const elapsed = performance.now() - startedAt
        const remaining = Math.max(0, MIN_RUN_DURATION_MS - elapsed)
        window.setTimeout(() => {
          setResult(nextResult)
          setError(nextError)
          setIsRunning(false)
        }, remaining)
      })
    })
  }

  return (
    <Grid
      h="full"
      p={{ base: "3", md: "4" }}
      gap={{ base: "3", md: "4" }}
      templateColumns={{ base: "1fr", md: "260px 1fr", xl: "280px 1fr 1fr" }}
      templateRows={{ base: "auto auto auto", md: "1fr 1fr", xl: "1fr" }}
      templateAreas={{
        base: `"sidebar" "center" "output"`,
        md: `"sidebar center" "sidebar output"`,
        xl: `"sidebar center output"`,
      }}
    >
      <GridItem area="sidebar" minH="0" asChild>
        <Box {...glassPanel}>
          <AlgorithmSidebar
            selectedId={algorithm.id}
            onSelect={handleSelectAlgorithm}
          />
        </Box>
      </GridItem>

      <GridItem area="center" minH="0" asChild>
        <Box {...glassPanel}>
          <ConfigPanel
            algorithm={algorithm}
            variantId={variantId}
            onVariantChange={setVariantId}
            operation={operation}
            onOperationChange={handleOperationChange}
            payload={payload}
            onPayloadChange={handlePayloadChange}
            onRun={handleRun}
            isRunning={isRunning}
          />
        </Box>
      </GridItem>

      <GridItem area="output" minH="0" asChild>
        <Box {...glassPanel}>
          <OutputPanel
            algorithmId={algorithm.id}
            variantId={variantId}
            result={result}
            error={error}
            isRunning={isRunning}
          />
        </Box>
      </GridItem>
    </Grid>
  )
}
