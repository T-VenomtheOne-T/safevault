# SafeVault security architecture

## Security boundary

The API stores encrypted secret payloads, not plaintext. TLS is required outside local development. Browser clients must never receive server encryption keys.

## Authentication and sessions

- Passwords will use Argon2id with parameters reviewed before release.
- Access tokens will be short-lived JWTs.
- Refresh tokens will be random opaque values, stored only as SHA-256 hashes, rotated on use, and sent in `HttpOnly`, `Secure`, `SameSite` cookies.
- Logout and password changes will revoke outstanding refresh tokens.

## Vault encryption

- Secret payloads will use AES-256-GCM with a fresh 96-bit IV for every encryption operation.
- The IV, authentication tag, and a key version are stored beside the ciphertext; no plaintext secret fields are persisted.
- The production master key belongs in a managed key service. A development-only environment key is acceptable solely for local work and must never be committed.
- Key rotation needs a versioned migration process before production use.

## Audit logging

Audit logs are append-only application records. They record security events and request context, never passwords, tokens, decrypted content, or full secret values.

## Current non-goals

MFA, password reset delivery, encrypted file attachments, secret sharing, and client-side end-to-end encryption are intentionally deferred until the authentication and vault workflows are tested.
