import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  Input,
  NativeSelect,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react"
import { LuPlay } from "react-icons/lu"
import { algorithmRegistry } from "@/lib/registry"
import type { Algorithm, OperationPayload } from "@/types/algorithm"

interface ConfigPanelProps {
  algorithm: Algorithm
  variantId: string
  onVariantChange: (id: string) => void
  operation: string
  onOperationChange: (operation: string) => void
  payload: OperationPayload
  onPayloadChange: (key: string, value: string) => void
  onRun: () => void
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
}: ConfigPanelProps) {
  const fields =
    algorithmRegistry[algorithm.id]?.operations.find(
      (op) => op.name === operation,
    )?.fields ?? []

  return (
    <Stack gap="4" p="4" h="full">
      <Box>
        <HStack gap="2" mb="1">
          <Heading size="md">{algorithm.name}</Heading>
          <Badge colorPalette="gray" variant="subtle">
            {algorithm.codename}
          </Badge>
          <Badge colorPalette="blue" variant="subtle">
            {algorithm.fips}
          </Badge>
        </HStack>
        <Text fontSize="sm" color="fg.muted">
          {algorithm.description}
        </Text>
      </Box>

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
            <Stack key={field.key} gap="1">
              <Text fontSize="xs" fontWeight="medium" color="fg.muted">
                {field.label}
              </Text>
              {field.type === "textarea" ? (
                <Textarea
                  value={payload[field.key] ?? ""}
                  onChange={(e) => onPayloadChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  fontFamily="mono"
                  fontSize="sm"
                  minH="24"
                  resize="none"
                />
              ) : (
                <Input
                  value={payload[field.key] ?? ""}
                  onChange={(e) => onPayloadChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  fontFamily="mono"
                  fontSize="sm"
                />
              )}
            </Stack>
          ))}
        </Stack>
      )}

      <HStack justify="flex-end">
        <Button colorPalette="blue" onClick={onRun}>
          <LuPlay />
          Run
        </Button>
      </HStack>
    </Stack>
  )
}
