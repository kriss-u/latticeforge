# Latticeforge

A focused, browser-based toolkit for post-quantum cryptography. Pick a NIST-standardized algorithm, configure it, and run it against your input — all client-side.

Unlike general-purpose crypto toolkits (e.g. CyberChef), Latticeforge is PQC-only and does not support chaining or stacking operations. Each run is a single algorithm with a single configuration, applied to a single input.

## Supported algorithms

| Algorithm | Codename   | FIPS     | Category               |
| --------- | ---------- | -------- | ----------------------- |
| ML-KEM    | Kyber      | FIPS 203 | Key Encapsulation (KEM) |
| ML-DSA    | Dilithium  | FIPS 204 | Signature                |
| FN-DSA    | Falcon     | FIPS 206 | Signature                |
| SLH-DSA   | SPHINCS+   | FIPS 205 | Hash-based Signature     |

## Tech stack

- React 19 + TypeScript, built with Vite
- Chakra UI v3 for the interface
- [`@noble/post-quantum`](https://github.com/paulmillr/noble-post-quantum) for the underlying cryptographic implementations

## Getting started

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run build     # type-check and build for production
npm run preview   # preview the production build
```

## Deployment

Live at [latticeforge.nepcodex.com](https://latticeforge.nepcodex.com).

## License

BSD-3-Clause
