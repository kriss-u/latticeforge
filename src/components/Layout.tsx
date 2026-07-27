import { Box, Flex, HStack, Text } from "@chakra-ui/react"
import { Link as RouterLink, Outlet } from "react-router-dom"
import { ColorModeButton } from "@/components/ui/color-mode"
import Logo from "@/components/Logo"

export default function Layout() {
  return (
    <Flex direction="column" h="100vh" position="relative" overflow="hidden" bg="bg.default">
      <Box
        position="absolute"
        inset="0"
        pointerEvents="none"
        overflow="hidden"
        zIndex="0"
      >
        <Box
          position="absolute"
          top="-20%"
          left="-10%"
          boxSize={{ base: "55vw", md: "30vw" }}
          rounded="full"
          bg="brand.500"
          opacity={{ base: "0.05", _dark: "0.07" }}
          filter="blur(130px)"
        />
        <Box
          position="absolute"
          bottom="-24%"
          right="-8%"
          boxSize={{ base: "60vw", md: "34vw" }}
          rounded="full"
          bg="ember.500"
          opacity={{ base: "0.035", _dark: "0.05" }}
          filter="blur(150px)"
        />
      </Box>

      <HStack
        as="nav"
        px="5"
        py="3"
        gap="6"
        borderBottomWidth="1px"
        borderColor="border.muted"
        flexShrink="0"
        position="relative"
        zIndex="1"
        bg={{ base: "whiteAlpha.600", _dark: "whiteAlpha.50" }}
        backdropFilter="blur(20px) saturate(140%)"
      >
        <HStack asChild gap="2.5" _hover={{ opacity: 0.85 }}>
          <RouterLink to="/">
            <Box color="fg.default" flexShrink="0">
              <Logo size={24} />
            </Box>
            <Text fontWeight="semibold" fontSize="md" letterSpacing="tight">
              Latticeforge
            </Text>
          </RouterLink>
        </HStack>
        <Box flex="1" />
        <Text asChild fontSize="sm" color="fg.muted" _hover={{ color: "fg.default" }}>
          <RouterLink to="/about">About</RouterLink>
        </Text>
        <ColorModeButton />
      </HStack>

      <Box flex="1" minH="0" overflow="auto" position="relative" zIndex="1">
        <Outlet />
      </Box>
    </Flex>
  )
}
