# Security Policy

## Supported Versions

The **KINETA** editorial web showcase is maintained as a zero-build, static ES Module architecture. Security updates and dependency integrity checks are applied to the latest `main` branch release:

| Version | Branch | Supported |
| ------- | ------ | --------- |
| `1.0.x` | `main` | ✅ Yes |
| `< 1.0` | Legacy | ❌ No |

---

## Architectural Security Posture

Because Kineta is a 100% static front-end application with no server-side database, authentication backend, or secret keys stored in the repository:
- **Zero Server Attack Surface**: Hosted directly via static CDN / GitHub Pages.
- **Client-Side Storage Scope**: `localStorage` is used strictly for non-sensitive cookie consent preferences (`kineta_cookie_consent_v1`).
- **Web3 / Solana Payment Safety**: Our Solana support integration (`3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm`) uses non-custodial **Solana Pay** URI links (`solana:...`) and direct address copying. We never request private keys, seed phrases, or blind transaction signatures.

> **IMPORTANT VERIFICATION NOTICE:**
> Always verify that the official Kineta Solana recipient address matches:
> `3HvUMCUSSHEdtA35UuD4J7mbgpTxJ7LgT2X7GfdzvBdm`

---

## Reporting a Vulnerability

If you discover a security vulnerability (such as DOM-based XSS, third-party CDN integrity issues, or spoofing vectors), please report it responsibly:

1. **Do NOT open a public GitHub issue** for exploitable vulnerabilities.
2. Send a detailed report to **hello@kineta.drink** with the subject line `[SECURITY] Kineta Vulnerability Report`, or use GitHub's **Private Vulnerability Reporting** tab if enabled on the repository.
3. Include:
   - A clear description of the issue and potential impact.
   - Step-by-step reproduction instructions or proof-of-concept code.
   - Suggested remediation if available.

### Response Timeline

- **Initial Acknowledgment**: Within **48 hours** of receipt.
- **Triage & Assessment**: Within **5 business days**.
- **Patch & Disclosure**: Confirmed vulnerabilities are patched on `main` promptly, with credit given to the reporting researcher upon coordinated disclosure.
