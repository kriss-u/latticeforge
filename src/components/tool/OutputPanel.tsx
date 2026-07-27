import { useState } from "react"
import {
  Box,
  Center,
  HStack,
  IconButton,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react"
import { LuCheck, LuCopy } from "react-icons/lu"

interface OutputPanelProps {
  output: string
}

export default function OutputPanel({ output }: OutputPanelProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Stack gap="2" p="4" h="full">
      <HStack justify="space-between">
        <Text fontSize="xs" fontWeight="medium" color="fg.muted">
          Output
        </Text>
        <IconButton
          aria-label="Copy output"
          size="xs"
          variant="ghost"
          disabled={!output}
          onClick={handleCopy}
        >
          {copied ? <LuCheck /> : <LuCopy />}
        </IconButton>
      </HStack>

      <Box position="relative" flex="1" minH="40">
        <Textarea
          value={output}
          readOnly
          placeholder=""
          fontFamily="mono"
          fontSize="sm"
          h="full"
          resize="none"
          bg="bg.subtle"
        />
        {!output && (
          <Center
            position="absolute"
            inset="0"
            pointerEvents="none"
            px="4"
          >
            <Text fontSize="sm" color="fg.muted" textAlign="center">
              Configure the algorithm and press Run to see output here.
            </Text>
          </Center>
        )}
      </Box>
    </Stack>
  )
}
