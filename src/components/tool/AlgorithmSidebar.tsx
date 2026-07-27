import { useMemo, useState } from "react"
import { Box, Input, Stack, Text } from "@chakra-ui/react"
import { LuSearch } from "react-icons/lu"
import { algorithmCategories, algorithms } from "@/data/algorithms"
import type { Algorithm } from "@/types/algorithm"

interface AlgorithmSidebarProps {
  selectedId: string
  onSelect: (algorithm: Algorithm) => void
}

export default function AlgorithmSidebar({
  selectedId,
  onSelect,
}: AlgorithmSidebarProps) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return algorithms
    return algorithms.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.codename.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <Stack
      gap="4"
      p="4"
      borderRightWidth={{ base: "0", md: "1px" }}
      borderBottomWidth={{ base: "1px", md: "0" }}
      h="full"
      overflowY="auto"
    >
      <Box position="relative">
        <Box
          position="absolute"
          insetY="0"
          left="0"
          pl="3"
          display="flex"
          alignItems="center"
          pointerEvents="none"
          color="fg.muted"
        >
          <LuSearch size={16} />
        </Box>
        <Input
          placeholder="Search algorithms..."
          size="sm"
          pl="8"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Box>

      <Stack gap="5">
        {algorithmCategories.map((category) => {
          const items = filtered.filter((a) => a.category === category)
          if (items.length === 0) return null
          return (
            <Box key={category}>
              <Text
                fontSize="xs"
                fontWeight="semibold"
                color="fg.muted"
                textTransform="uppercase"
                letterSpacing="wide"
                mb="2"
                px="2"
              >
                {category}
              </Text>
              <Stack gap="1">
                {items.map((algorithm) => {
                  const selected = algorithm.id === selectedId
                  return (
                    <Box
                      key={algorithm.id}
                      as="button"
                      onClick={() => onSelect(algorithm)}
                      textAlign="left"
                      w="full"
                      px="3"
                      py="2"
                      rounded="md"
                      bg={selected ? "colorPalette.subtle" : "transparent"}
                      color={selected ? "colorPalette.fg" : "fg.default"}
                      colorPalette="blue"
                      _hover={{ bg: selected ? "colorPalette.subtle" : "bg.muted" }}
                      transition="background 0.15s"
                    >
                      <Text fontWeight="medium" fontSize="sm">
                        {algorithm.name}
                      </Text>
                      <Text fontSize="xs" color="fg.muted">
                        {algorithm.codename}
                      </Text>
                    </Box>
                  )
                })}
              </Stack>
            </Box>
          )
        })}
        {filtered.length === 0 && (
          <Text fontSize="sm" color="fg.muted" px="2">
            No algorithms match "{query}".
          </Text>
        )}
      </Stack>
    </Stack>
  )
}
