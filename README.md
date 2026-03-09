# Zero-Vault: Secure Password Manager

> **Status:** 🟢 Completed (v1.0.0)
>
> An industry-grade, zero-knowledge password management solution designed for maximum security and seamless multi-device synchronization. Features robust frontend techniques, a highly secure backend API, distributed conflict-resolution mechanisms, and a native C11-based risk engine.

![Vault Preview](https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1600&h=400)

## Table of Contents

- [Intro](#intro)
- [About](#about)
- [Epics & Core Features](#epics--core-features)
- [Tech Stack](#tech-stack)
- [Installing and Running](#installing-and-running)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [License](#license)

## Intro

**Zero-Vault** is a comprehensive, industry-grade, zero-knowledge password management solution designed for maximum security, privacy, and seamless multi-device synchronization.

## About

Built from the ground up to ensure your sensitive data never leaves your local environment in a decrypted state, Zero-Vault leverages robust frontend techniques, a highly secure backend API, distributed conflict-resolution mechanisms, and a native C11-based risk engine.

It ensures that your secrets remain under your control using a "Zero-Knowledge" architecture.

## Epics & Core Features

### 1. Secure Frontend Vault & User Control (Epic 1)
- **Zero-Knowledge UI**: Fast, responsive React frontend. Vault contents are decrypted locally and never transmitted in plaintext.
- **Safety & Exposure Control**: Features like a smart password generator, strength meter, auto-hide, and clipboard auto-clearing ensure passwords aren't accidentally exposed.
- **Session Security**: Auto-lock timers and emergency "Panic Lock" instantly clear sensitive memory.
- **Performance**: Optimized virtualized lists and state management to handle thousands of encrypted entries smoothly.

### 2. Autofill, Transparency & Encrypted Sync (Epic 2)
- **Anti-Phishing Autofill**: Browser extension integration restricts autofill to verified domains with visual warnings for suspicious sites.
- **Encryption Transparency**: UI explicitly visualizes the "Encrypting -> Uploading -> Complete" flow without exposing raw data.
- **Immediate User Feedback**: Toast notifications confirm interactions like "Vault Unlocked" or "Password Copied".

### 3. Secure Backend Services (Epic 3)
- **Passwordless Authentication**: SRP-like proofs ensure the backend never processes or stores the master password.
- **API Access Control**: Strict JWT validation and device-aware access management.
- **Blind Encrypted Storage**: Accepts only verified encrypted blobs, mitigating backend breaches.
- **Abuse Protection & Devic Revocation**: Throttling, rate-limiting, and the ability to instantly revoke active sessions across compromised devices.

### 4. Distributed State Management & Sync (Epic 4)
- **Local-First & Offline Ready**: Full CRUD operations are available offline, versioned locally, and queued for synchronization.
- **Encrypted Incremental Sync**: Only changed/new encrypted entries (deltas) are uploaded, scaling gracefully for large vaults.
- **Eventual Convergence**: Intelligent catch-up syncing logic ensures all registered devices eventually mirror the same vault state securely.

### 5. Client-Side Conflict Resolution (Epic 5)
- **Concurrent Update Detection**: Identifies state divergence (e.g., HTTP 409 Conflict) without server decryption.
- **Deterministic Merge**: Utilizes Last-Write-Wins (LWW) and timestamps to handle same-entry updates across devices.
- **Delete Priority & Tombstones**: Outdated conflicting updates cannot resurrect intentionally deleted data via encrypted tombstones.
- **Encrypted History**: "Losing" versions of a conflict are retained in encrypted history for potential recovery.

### 6. Adaptive Risk-Based Authentication & Crypto Engine (Epic 6)
- **Native C11 Risk Engine**: A fully offline, highly deterministic risk evaluation pipeline.
- **Tamper-Evident Audit Logging**: Cryptographically verifiable operations logged via immutable hash chaining, preventing tampering.
- **Fail-Secure Defaults**: Any detected risk anomalies or systemic failures default to restrictive, high-security states (no weak fallbacks).
- **Single Enforcement Gateway**: All auth traffic funnels through a unified and verifiable gateway layer.

## Tech Stack

- **Frontend:** [React 19](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/), [Wouter](https://github.com/molefrog/wouter)
- **Backend:** [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [Supabase (PostgreSQL)](https://supabase.com/)
- **Security & Risk Engine:** Native C11
- **Testing:** [Vitest](https://vitest.dev/), [Jest](https://jestjs.io/), [Playwright](https://playwright.dev/), [k6](https://k6.io/)

## Installing and Running

### Prerequisites

- **Node.js**: v20.19+ or v22.12+ recommended
- **npm**: v10.5.2+
- **Supabase Account**
- **GCC/Make** (for compiling the C11 Risk Engine)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/SricharanAsr/Zero-Vault-Secure-Password-Manager.git
    cd Zero-Vault-Secure-Password-Manager
    ```

### 1. Risk Engine Configuration
Navigate to the `risk-engine/` directory and compile the security engine:
```bash
cd risk-engine
make all
./run_all_unit_tests.sh
```

### 2. Backend Server Configuration
1. Navigate to the server folder: 
   ```bash
   cd App/secure_password_demo/server
   ```
2. Create your `.env` configuration:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
3. Install dependencies and start: 
   ```bash
   npm install --ignore-scripts
   npm run dev
   ```

### 3. Frontend Client Configuration
1. Navigate to the client folder: 
   ```bash
   cd App/secure_password_demo/client
   ```
2. Install tools and launch the server: 
   ```bash
   npm install
   npm run dev
   ```

## Project Structure

```bash
Zero-Vault/
├── App/
│   └── secure_password_demo/
│       ├── client/         # Frontend React Application
│       └── server/         # Node.js/Express Backend Services
├── risk-engine/            # Native C11 Security & Cryptography Engine
│   ├── src/                # Core C logic (Determinism, Secure Memory)
│   ├── include/            # C Header files
│   └── test/               # C compiled unit tests
├── api/                    # API Documentation & Interfaces
├── scripts/                # CI/CD and QA Touch Reporter integrations
├── README.md               # Overall Project Documentation
└── package.json            # Root configuration
```

## Troubleshooting

### "Vite command not found"
Ensure you have installed dependencies correctly in the `client` directory:
```bash
npm install
```

### "Database connection error"
Ensure your `.env` file in the `server` directory possesses the correct Supabase credentials.

## Testing & Quality Assurance

Rigorous automated testing operates at multiple layers:

*   **Native C Unit Tests**: Memory protection, deterministic execution, and hash chain integrity.
*   **Backend Integration**: Execute via `npm test` inside the `server/` directory to run Jest.
*   **E2E (Playwright)**: Run `npx playwright test` inside the `client/` directory for full flow verification.
*   **QA Reporting**: Run `node scripts/qa-touch-reporter.js` to synchronize results with the QA tracker.

## License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

**Copyright © 2026 Zero-Vault Contributors.**