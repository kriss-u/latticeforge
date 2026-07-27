import { Box, Flex, HStack } from "@chakra-ui/react"
import { Link as RouterLink, Outlet } from "react-router-dom"
import { ColorModeButton } from "@/components/ui/color-mode"

export default function Layout() {
  return (
    <Flex direction="column" h="100vh">
      <HStack as="nav" px="4" py="3" gap="6" borderBottomWidth="1px" flexShrink="0">
        <RouterLink to="/">
          <strong>pqc-io</strong>
        </RouterLink>
        <RouterLink to="/contact">Contact</RouterLink>
        <RouterLink to="/privacy-policy">Privacy Policy</RouterLink>
        <Box flex="1" />
        <ColorModeButton />
      </HStack>
      <Box flex="1" minH="0" overflow="auto">
        <Outlet />
      </Box>
    </Flex>
  )
}
