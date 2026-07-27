import { useEffect, useRef, useState } from "react"
import {
  Box,
  Center,
  HStack,
  IconButton,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react"
import { LuCheck, LuCopy, LuDownload } from "react-icons/lu"
import { hexToBytes } from "@noble/hashes/utils.js"
import type { OperationResult } from "@/types/algorithm"

interface OutputPanelProps {
  algorithmId: string
  variantId: string
  result: OperationResult | null
  error: string | null
}

/** File extensions that reflect what the byte field actually holds. */
const FIELD_EXTENSIONS: Record<string, string> = {
  publicKey: "pub",
  secretKey: "key",
  signature: "sig",
  cipherText: "ct",
  sharedSecret: "secret",
  seed: "seed",
}

export default function OutputPanel({
  algorithmId,
  variantId,
  result,
  error,
}: OutputPanelProps) {
  const hasOutput = Boolean(error || result?.summary || result?.fields?.length)

  return (
    <Stack gap="4" p="4" h="full" overflowY="auto">
      <HStack justify="space-between">
        <Text fontSize="xs" fontWeight="medium" color="fg.muted">
          Output
        </Text>
      </HStack>

      {!hasOutput && (
        <Box position="relative" flex="1" minH="40">
          <Center position="absolute" inset="0" px="4">
            <Text fontSize="sm" color="fg.muted" textAlign="center">
              Configure the algorithm and press Run to see output here.
            </Text>
          </Center>
        </Box>
      )}

      {error && <OutputField label="Error" value={error} color="fg.error" />}

      {result?.summary && <OutputField label="Result" value={result.summary} />}

      {result?.fields?.map((field) => (
        <OutputField
          key={field.key}
          label={field.label}
          value={field.value}
          binary={field.binary}
          fileName={`${algorithmId}-${variantId}-${field.key}.${
            FIELD_EXTENSIONS[field.key] ?? "bin"
          }`}
        />
      ))}
    </Stack>
  )
}

interface OutputFieldProps {
  label: string
  value: string
  binary?: boolean
  fileName?: string
  color?: string
}

function OutputField({ label, value, binary, fileName, color }: OutputFieldProps) {
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleDownload = () => {
    const bytes = hexToBytes(value)
    const blob = new Blob([bytes], { type: "application/octet-stream" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName ?? "output.bin"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Stack gap="1">
      <HStack justify="space-between">
        <Text fontSize="xs" fontWeight="medium" color="fg.muted">
          {label}
        </Text>
        <HStack gap="1">
          {binary && (
            <IconButton
              aria-label={`Download ${label} as binary`}
              size="2xs"
              variant="ghost"
              onClick={handleDownload}
            >
              <LuDownload />
            </IconButton>
          )}
          <IconButton
            aria-label={`Copy ${label}`}
            size="2xs"
            variant="ghost"
            onClick={handleCopy}
          >
            {copied ? <LuCheck /> : <LuCopy />}
          </IconButton>
        </HStack>
      </HStack>
      <Textarea
        ref={textareaRef}
        value={value}
        readOnly
        fontFamily="mono"
        fontSize="sm"
        minH="20"
        resize="none"
        overflow="hidden"
        bg="bg.subtle"
        color={color}
      />
    </Stack>
  )
}
