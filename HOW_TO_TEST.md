# Zero-Vault: Testing Documentation & Guides

This guide provides step-by-step instructions on how to run all test suites in the Zero-Vault project, covering every layer from the native core to the browser-based end-to-end simulations.

---

## 1. Risk Engine Core (C11 Native Tests)
These tests verify low-level security logic, memory safety, and cryptographic integrity.

### Run All Tests
```bash
cd "risk-engine"
./run_all_unit_tests.sh
```

### Run Individual Tests
```bash
# Compile a specific test
make test_integrity

# Execute binary
./test_integrity
```

---

## 2. Backend Server (Node.js/Jest)
Verifies API endpoints, authentication tokens, and server-side encryption contracts.

### Run All Server Tests
```bash
cd "App/secure_password_demo/server"
npm test
```

### Run Individual Test File
```bash
npx jest tests/api-encryption.test.ts
```

---

## 3. Frontend Client (React/Vitest)
Validates UI components, password generation, and client-side encryption utilities.

### Run All Frontend Tests
```bash
cd "App/secure_password_demo/client"
npm test
```

### Run Individual File
```bash
npm test utils/crypto.test.ts
```

---

## 4. End-to-End Tests (Playwright)
Simulates real user actions in Chromium, Firefox, and WebKit (Safari).

### Run All E2E Tests
```bash
cd "App/secure_password_demo"
npx playwright test
```

### Run Specific Spec
```bash
npx playwright test e2e/tests/vault-creation.spec.ts
```

---

## 5. Performance Tests (k6)
Measures system resilience under high load and large datasets.

### Run Performance Suite
```bash
cd "App/secure_password_demo/performance"
k6 run load-test.js
```

---

## Summary for Continuous Integration
To verify the entire project in sequence (as the CI/CD pipeline does):
1. **Security Core**: `cd risk-engine && ./run_all_unit_tests.sh`
2. **Backend**: `cd App/secure_password_demo/server && npm test`
3. **Frontend**: `cd App/secure_password_demo/client && npm test`
4. **Integration**: `cd App/secure_password_demo && npx playwright test`
