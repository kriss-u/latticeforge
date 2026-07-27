import { Box, Container, HStack } from "@chakra-ui/react"
import { Link as RouterLink, Outlet } from "react-router-dom"
import { ColorModeButton } from "@/components/ui/color-mode"

export default function Layout() {
  return (
    <Box>
      <HStack as="nav" p="4" gap="6" borderBottomWidth="1px">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/contact">Contact</RouterLink>
        <RouterLink to="/privacy-policy">Privacy Policy</RouterLink>
        <Box flex="1" />
        <ColorModeButton />
      </HStack>
      <Container maxW="4xl" py="8">
        <Outlet />
      </Container>
    </Box>
  )
}
