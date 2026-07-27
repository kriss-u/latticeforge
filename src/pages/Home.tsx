import { useState } from "react"
import { Grid, GridItem } from "@chakra-ui/react"
import AlgorithmSidebar from "@/components/tool/AlgorithmSidebar"
import ConfigPanel from "@/components/tool/ConfigPanel"
import OutputPanel from "@/components/tool/OutputPanel"
import { algorithms } from "@/data/algorithms"
import type { Algorithm } from "@/types/algorithm"

export default function Home() {
  const [algorithm, setAlgorithm] = useState<Algorithm>(algorithms[0])
  const [variantId, setVariantId] = useState(algorithms[0].variants[0].id)
  const [operation, setOperation] = useState(algorithms[0].operations[0])
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")

  const handleSelectAlgorithm = (next: Algorithm) => {
    setAlgorithm(next)
    setVariantId(next.variants[0].id)
    setOperation(next.operations[0])
    setOutput("")
  }

  const handleRun = () => {
    const variant = algorithm.variants.find((v) => v.id === variantId)
    setOutput(
      `[${variant?.label} - ${operation}]\n\nOutput not yet implemented.\n\nInput received (${input.length} bytes):\n${input}`,
    )
  }

  return (
    <Grid
      h="full"
      templateColumns={{ base: "1fr", md: "260px 1fr", xl: "280px 1fr 1fr" }}
      templateRows={{ base: "auto auto auto", md: "1fr 1fr", xl: "1fr" }}
      templateAreas={{
        base: `"sidebar" "center" "output"`,
        md: `"sidebar center" "sidebar output"`,
        xl: `"sidebar center output"`,
      }}
    >
      <GridItem area="sidebar" minH="0">
        <AlgorithmSidebar
          selectedId={algorithm.id}
          onSelect={handleSelectAlgorithm}
        />
      </GridItem>

      <GridItem
        area="center"
        minH="0"
        borderRightWidth={{ base: "0", xl: "1px" }}
        borderBottomWidth={{ base: "1px", xl: "0" }}
      >
        <ConfigPanel
          algorithm={algorithm}
          variantId={variantId}
          onVariantChange={setVariantId}
          operation={operation}
          onOperationChange={setOperation}
          input={input}
          onInputChange={setInput}
          onRun={handleRun}
        />
      </GridItem>

      <GridItem area="output" minH="0">
        <OutputPanel output={output} />
      </GridItem>
    </Grid>
  )
}
