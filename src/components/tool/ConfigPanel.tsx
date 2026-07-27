import {
  Badge,
  Box,
  Button,
  Heading,
  HStack,
  NativeSelect,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react"
import { LuPlay } from "react-icons/lu"
import type { Algorithm } from "@/types/algorithm"

interface ConfigPanelProps {
  algorithm: Algorithm
  variantId: string
  onVariantChange: (id: string) => void
  operation: string
  onOperationChange: (operation: string) => void
  input: string
  onInputChange: (value: string) => void
  onRun: () => void
}

export default function ConfigPanel({
  algorithm,
  variantId,
  onVariantChange,
  operation,
  onOperationChange,
  input,
  onInputChange,
  onRun,
}: ConfigPanelProps) {
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

      <Stack gap="2" flex="1" minH="0">
        <Text fontSize="xs" fontWeight="medium" color="fg.muted">
          Input
        </Text>
        <Textarea
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Paste or type input data here..."
          fontFamily="mono"
          fontSize="sm"
          flex="1"
          minH="40"
          resize="none"
        />
      </Stack>

      <HStack justify="flex-end">
        <Button colorPalette="blue" onClick={onRun}>
          <LuPlay />
          Run
        </Button>
      </HStack>
    </Stack>
  )
}
