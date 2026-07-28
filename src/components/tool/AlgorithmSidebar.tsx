import { useMemo, useState } from "react"
import {
  Badge,
  Box,
  Drawer,
  HStack,
  IconButton,
  Input,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react"
import { LuMenu, LuSearch, LuX } from "react-icons/lu"
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
  const [isOpen, setIsOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return algorithms
    return algorithms.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.codename.toLowerCase().includes(q),
    )
  }, [query])

  const selectedAlgorithm = algorithms.find((a) => a.id === selectedId)

  const list = (
    <Stack gap="4">
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
                      onClick={() => {
                        onSelect(algorithm)
                        setIsOpen(false)
                      }}
                      textAlign="left"
                      w="full"
                      px="3"
                      py="2"
                      rounded="md"
                      bg={selected ? "colorPalette.subtle" : "transparent"}
                      color={selected ? "colorPalette.fg" : "fg.default"}
                      colorPalette="brand"
                      _hover={{ bg: selected ? "colorPalette.subtle" : "bg.muted" }}
                      transition="background 0.15s"
                    >
                      <HStack gap="1.5">
                        <Text fontWeight="medium" fontSize="sm">
                          {algorithm.name}
                        </Text>
                        {algorithm.status && (
                          <Badge size="xs" colorPalette="orange" variant="subtle">
                            {algorithm.status.label}
                          </Badge>
                        )}
                      </HStack>
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

  return (
    <Box h={{ base: "auto", md: "full" }}>
      <HStack
        as="button"
        display={{ base: "flex", md: "none" }}
        onClick={() => setIsOpen(true)}
        justify="space-between"
        w="full"
        p="4"
      >
        <HStack gap="2.5">
          <LuMenu size={18} />
          <Stack gap="0" align="flex-start">
            <Text fontSize="xs" fontWeight="semibold" color="fg.muted" textTransform="uppercase" letterSpacing="wide">
              Algorithm
            </Text>
            <Text fontWeight="medium" fontSize="sm">
              {selectedAlgorithm?.name ?? "Select an algorithm"}
            </Text>
          </Stack>
        </HStack>
      </HStack>

      <Box
        display={{ base: "none", md: "block" }}
        p="4"
        borderRightWidth="1px"
        h="full"
        overflowY="auto"
      >
        {list}
      </Box>

      <Drawer.Root
        open={isOpen}
        onOpenChange={(d) => setIsOpen(d.open)}
        placement="start"
        size="xs"
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Algorithms</Drawer.Title>
                <Drawer.CloseTrigger asChild>
                  <IconButton aria-label="Close" size="sm" variant="ghost">
                    <LuX />
                  </IconButton>
                </Drawer.CloseTrigger>
              </Drawer.Header>
              <Drawer.Body>{list}</Drawer.Body>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </Box>
  )
}
