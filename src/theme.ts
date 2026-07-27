import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react"

const config = defineConfig({
  theme: {
    tokens: {
      fonts: {
        heading: { value: "'IBM Plex Sans', system-ui, sans-serif" },
        body: { value: "'IBM Plex Sans', system-ui, sans-serif" },
        mono: { value: "'IBM Plex Mono', ui-monospace, monospace" },
      },
      colors: {
        brand: {
          50: { value: "#eefcfb" },
          100: { value: "#d3f7f3" },
          200: { value: "#a3ede6" },
          300: { value: "#69dcd2" },
          400: { value: "#34c2b6" },
          500: { value: "#189d93" },
          600: { value: "#127d77" },
          700: { value: "#106462" },
          800: { value: "#11504f" },
          900: { value: "#124342" },
          950: { value: "#052625" },
        },
        ember: {
          400: { value: "#ff9d5c" },
          500: { value: "#ff7a3d" },
          600: { value: "#e85f24" },
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: { base: "{colors.brand.600}", _dark: "{colors.brand.400}" } },
          contrast: { value: { base: "white", _dark: "{colors.brand.950}" } },
          fg: { value: { base: "{colors.brand.700}", _dark: "{colors.brand.300}" } },
          muted: { value: { base: "{colors.brand.100}", _dark: "{colors.brand.900}" } },
          subtle: { value: { base: "{colors.brand.50}", _dark: "{colors.brand.950}" } },
          emphasized: { value: { base: "{colors.brand.200}", _dark: "{colors.brand.800}" } },
          focusRing: { value: { base: "{colors.brand.600}", _dark: "{colors.brand.400}" } },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
