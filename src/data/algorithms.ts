import type { Algorithm, AlgorithmCategory } from "@/types/algorithm"

export const algorithms: Algorithm[] = [
  {
    id: "ml-kem",
    name: "ML-KEM",
    codename: "Kyber",
    fips: "FIPS 203",
    category: "KEM",
    description:
      "Module-lattice-based key encapsulation mechanism standardized by NIST.",
    variants: [
      { id: "ml-kem-512", label: "ML-KEM-512" },
      { id: "ml-kem-768", label: "ML-KEM-768" },
      { id: "ml-kem-1024", label: "ML-KEM-1024" },
    ],
    operations: ["Keygen", "Encapsulate", "Decapsulate"],
  },
  {
    id: "ml-dsa",
    name: "ML-DSA",
    codename: "Dilithium",
    fips: "FIPS 204",
    category: "Signature",
    description:
      "Module-lattice-based digital signature algorithm standardized by NIST.",
    variants: [
      { id: "ml-dsa-44", label: "ML-DSA-44" },
      { id: "ml-dsa-65", label: "ML-DSA-65" },
      { id: "ml-dsa-87", label: "ML-DSA-87" },
    ],
    operations: ["Keygen", "Sign", "Verify"],
  },
  {
    id: "fn-dsa",
    name: "FN-DSA",
    codename: "Falcon",
    fips: "FIPS 206",
    category: "Signature",
    description:
      "Fast-Fourier lattice-based, NTRU-based digital signature algorithm standardized by NIST.",
    variants: [
      { id: "fn-dsa-512", label: "FN-DSA-512" },
      { id: "fn-dsa-1024", label: "FN-DSA-1024" },
    ],
    operations: ["Keygen", "Sign", "Verify"],
  },
  {
    id: "slh-dsa",
    name: "SLH-DSA",
    codename: "SPHINCS+",
    fips: "FIPS 205",
    category: "Hash-based Signature",
    description:
      "Stateless hash-based digital signature algorithm standardized by NIST.",
    variants: [
      { id: "slh-dsa-128s", label: "SLH-DSA-128s" },
      { id: "slh-dsa-192s", label: "SLH-DSA-192s" },
      { id: "slh-dsa-256s", label: "SLH-DSA-256s" },
    ],
    operations: ["Keygen", "Sign", "Verify"],
  },
]

export const algorithmCategories: AlgorithmCategory[] = [
  "KEM",
  "Signature",
  "Hash-based Signature",
]
