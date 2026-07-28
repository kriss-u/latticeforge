import { useRef } from "react"
import {
  Alert,
  Badge,
  Box,
  Button,
  Checkbox,
  Heading,
  HStack,
  IconButton,
  Input,
  Link,
  NativeSelect,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react"
import { LuExternalLink, LuPlay, LuUpload } from "react-icons/lu"
import { bytesToHex } from "@noble/hashes/utils.js"
import { algorithmRegistry } from "@/lib/registry"
import type { Algorithm, FieldDef, OperationPayload } from "@/types/algorithm"

interface ConfigPanelProps {
  algorithm: Algorithm
  variantId: string
  onVariantChange: (id: string) => void
  operation: string
  onOperationChange: (operation: string) => void
  payload: OperationPayload
  onPayloadChange: (key: string, value: string) => void
  onRun: () => void
  isRunning: boolean
}

export default function ConfigPanel({
  algorithm,
  variantId,
  onVariantChange,
  operation,
  onOperationChange,
  payload,
  onPayloadChange,
  onRun,
  isRunning,
}: ConfigPanelProps) {
  const fields =
    algorithmRegistry[algorithm.id]?.operations.find(
      (op) => op.name === operation,
    )?.fields ?? []

  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadTargetKey = useRef<string | null>(null)

  const requestUpload = (key: string) => {
    uploadTargetKey.current = key
    fileInputRef.current?.click()
  }

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const key = uploadTargetKey.current
    e.target.value = ""
    if (!file || !key) return
    const bytes = new Uint8Array(await file.arrayBuffer())
    onPayloadChange(key, bytesToHex(bytes))
    if (fields.some((f) => f.key === `${key}Hex`)) {
      onPayloadChange(`${key}Hex`, "true")
    }
  }

  return (
    <Stack gap="4" p="4" h="full">
      <input
        ref={fileInputRef}
        type="file"
        hidden
        onChange={handleFileSelected}
      />

      <HStack justify="space-between" align="flex-start">
        <Box>
          <HStack gap="2" mb="1">
            <Heading size="md">{algorithm.name}</Heading>
            <Badge colorPalette="gray" variant="subtle">
              {algorithm.codename}
            </Badge>
            <Badge colorPalette="brand" variant="subtle">
              {algorithm.fips}
            </Badge>
            {algorithm.status && (
              <Badge colorPalette="orange" variant="subtle">
                {algorithm.status.label}
              </Badge>
            )}
          </HStack>
          <Text fontSize="sm" color="fg.muted">
            {algorithm.description}
          </Text>
          <HStack gap="3" mt="1">
            <Link
              href={algorithm.wikiUrl}
              target="_blank"
              rel="noreferrer"
              color="brand.fg"
              fontSize="xs"
            >
              Wikipedia <LuExternalLink />
            </Link>
            <Link
              href={algorithm.nistUrl}
              target="_blank"
              rel="noreferrer"
              color="brand.fg"
              fontSize="xs"
            >
              NIST spec <LuExternalLink />
            </Link>
          </HStack>
        </Box>
        {!algorithm.status && (
          <Button
            colorPalette="brand"
            onClick={onRun}
            flexShrink="0"
            disabled={isRunning}
          >
            <LuPlay />
            Run
          </Button>
        )}
      </HStack>

      {algorithm.status && (
        <Alert.Root status="warning" variant="subtle">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>{algorithm.status.label}</Alert.Title>
            <Alert.Description>{algorithm.status.note}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}

      {!algorithm.status && (
        <>
          <HStack gap="4" flexWrap="wrap">
            <Box minW="40">
              <Text fontSize="xs" fontWeight="medium" color="fg.muted" mb="1">
                Parameter set
              </Text>
              <NativeSelect.Root size="sm">
                <NativeSelect.Field
                  value={variantId}
                  onChange={(e) => onVariantChange(e.target.value)}
                >
                  {algorithm.variants.map((variant) => (
                    <option key={variant.id} value={variant.id}>
                      {variant.label}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Box>

            <Box minW="40">
              <Text fontSize="xs" fontWeight="medium" color="fg.muted" mb="1">
                Operation
              </Text>
              <NativeSelect.Root size="sm">
                <NativeSelect.Field
                  value={operation}
                  onChange={(e) => onOperationChange(e.target.value)}
                >
                  {algorithm.operations.map((op) => (
                    <option key={op} value={op}>
                      {op}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
            </Box>
          </HStack>

          {fields.length === 0 ? (
            <Text fontSize="sm" color="fg.muted">
              This operation takes no input. Press Run to execute.
            </Text>
          ) : (
            <Stack gap="3" flex="1" minH="0" overflowY="auto">
              {fields.map((field) => (
                <FieldInput
                  key={field.key}
                  field={field}
                  value={payload[field.key] ?? ""}
                  onChange={(value) => onPayloadChange(field.key, value)}
                  onUpload={() => requestUpload(field.key)}
                />
              ))}
            </Stack>
          )}
        </>
      )}
    </Stack>
  )
}

interface FieldInputProps {
  field: FieldDef
  value: string
  onChange: (value: string) => void
  onUpload: () => void
}

function FieldInput({ field, value, onChange, onUpload }: FieldInputProps) {
  if (field.type === "checkbox") {
    return (
      <Checkbox.Root
        checked={value === "true"}
        onCheckedChange={(d) => onChange(d.checked ? "true" : "false")}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        <Checkbox.Label fontSize="sm">{field.label}</Checkbox.Label>
      </Checkbox.Root>
    )
  }

  return (
    <Stack gap="1">
      <HStack justify="space-between">
        <Text fontSize="xs" fontWeight="medium" color="fg.muted">
          {field.label}
          {field.optional ? " (optional)" : ""}
        </Text>
        {field.binary && (
          <IconButton
            aria-label={`Upload file for ${field.label}`}
            size="2xs"
            variant="ghost"
            onClick={onUpload}
          >
            <LuUpload />
          </IconButton>
        )}
      </HStack>
      {field.type === "textarea" ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          fontFamily="mono"
          fontSize="sm"
          minH="24"
          resize="none"
        />
      ) : (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          fontFamily="mono"
          fontSize="sm"
        />
      )}
    </Stack>
  )
}
