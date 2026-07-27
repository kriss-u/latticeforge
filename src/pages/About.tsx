import { Box, Heading, Link, Stack, Text } from "@chakra-ui/react"

export default function About() {
  return (
    <Box maxW="2xl" mx="auto" px={{ base: "4", md: "0" }} py={{ base: "8", md: "14" }}>
      <Stack gap="6">
        <Stack gap="2">
          <Heading size="2xl" letterSpacing="tight">
            About LatticeForge
          </Heading>
          <Text color="fg.muted">
            A focused toolkit for post-quantum cryptography.
          </Text>
        </Stack>

        <Text color="fg.default">
          LatticeForge runs NIST-standardized post-quantum algorithms —
          ML-KEM, ML-DSA, FN-DSA, and SLH-DSA — entirely in your browser. There's
          no server round-trip and no chaining of unrelated operations: pick an
          algorithm, configure it, and run it against your input.
        </Text>

        <Stack gap="2">
          <Heading size="md">Why it exists</Heading>
          <Text color="fg.default">
            Post-quantum primitives are becoming standard, but tooling to
            experiment with them is scattered. LatticeForge gives developers
            and researchers a single place to generate keys, encapsulate and
            decapsulate, sign and verify, without installing anything.
          </Text>
        </Stack>

        <Stack gap="2">
          <Heading size="md">Privacy</Heading>
          <Text color="fg.default">
            All cryptographic operations run client-side. Nothing you enter is
            sent to a server.
          </Text>
        </Stack>

        <Stack gap="2">
          <Heading size="md">Credits</Heading>
          <Text color="fg.default">
            Built on{" "}
            <Link href="https://github.com/paulmillr/noble-post-quantum" target="_blank" rel="noreferrer" color="brand.fg">
              @noble/post-quantum
            </Link>
            .
          </Text>
        </Stack>
      </Stack>
    </Box>
  )
}
