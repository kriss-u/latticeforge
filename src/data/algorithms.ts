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
    wikiUrl: "https://en.wikipedia.org/wiki/ML-KEM",
    nistUrl: "https://csrc.nist.gov/pubs/fips/203/final",
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
    wikiUrl: "https://en.wikipedia.org/wiki/NIST_Post-Quantum_Cryptography_Standardization",
    nistUrl: "https://csrc.nist.gov/pubs/fips/204/final",
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
    wikiUrl: "https://en.wikipedia.org/wiki/Falcon_(signature_scheme)",
    nistUrl: "https://csrc.nist.gov/projects/post-quantum-cryptography/post-quantum-cryptography-standardization",
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
    wikiUrl: "https://en.wikipedia.org/wiki/SPHINCS+",
    nistUrl: "https://csrc.nist.gov/pubs/fips/205/final",
  },
  {
    id: "hqc",
    name: "HQC",
    codename: "HQC",
    fips: "Draft (unassigned)",
    category: "KEM",
    description:
      "Code-based key encapsulation mechanism selected by NIST in March 2025 as a backup to ML-KEM.",
    variants: [],
    operations: [],
    status: {
      label: "Draft standard",
      note: "NIST selected HQC in March 2025 as the backup KEM in case a future weakness is found in lattice-based ML-KEM. Its FIPS standard is still in draft (expected around 2027), and no independently audited JavaScript/WASM implementation exists yet. LatticeForge will add it once one does.",
    },
    wikiUrl: "https://en.wikipedia.org/wiki/NIST_Post-Quantum_Cryptography_Standardization",
    nistUrl: "https://csrc.nist.gov/news/2025/hqc-announced-as-a-4th-round-selection",
  },
  {
    id: "lms-xmss",
    name: "LMS / XMSS",
    codename: "Stateful hash-based signatures",
    fips: "SP 800-208",
    category: "Stateful Hash-Based Signature",
    description:
      "Stateful hash-based signature schemes approved by NIST for specialized use cases such as firmware signing.",
    variants: [],
    operations: [],
    status: {
      label: "Not yet available",
      note: "LMS (RFC 8554) and XMSS (RFC 8391) were approved by NIST via SP 800-208, predating the main PQC competition. Unlike SLH-DSA, they are stateful — reusing a one-time key destroys security — which makes them risky to expose through a simple input/output tool without dedicated key-state management. No independently audited JS implementation was found either, so LatticeForge doesn't implement them yet.",
    },
    wikiUrl: "https://en.wikipedia.org/wiki/Hash-based_cryptography",
    nistUrl: "https://csrc.nist.gov/pubs/sp/800/208/final",
  },
]

export const algorithmCategories: AlgorithmCategory[] = [
  "KEM",
  "Signature",
  "Hash-based Signature",
  "Stateful Hash-Based Signature",
]
