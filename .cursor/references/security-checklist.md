# Security Checklist (Frontend)

Frontend-focused quick reference for WithFestival-v2-frontend. Use alongside `security-and-hardening`. **Out of scope:** password hashing, DB auth, SQL, server connection pools — those belong to the API backend.

## Threat Modeling (Start Here)

- [ ] Trust boundaries mapped (forms, URL params, `localStorage`/`sessionStorage`, third-party scripts, WebSocket messages, markdown/HTML content)
- [ ] Assets named (auth tokens, PII in UI, admin actions, payment-adjacent flows)
- [ ] Abuse cases written next to use cases ("how would I misuse this in the browser?")

## Pre-Commit Checks

- [ ] No secrets in code or committed `.env`
- [ ] `.gitignore` covers: `.env`, `.env.local`, `*.pem`, `*.key`
- [ ] No secrets in `NEXT_PUBLIC_*` or `VITE_*` (those are shipped to the browser)
- [ ] `SENTRY_AUTH_TOKEN` and Notion tokens stay server/build-only — never in client bundles

## Client Authentication & Session

- [ ] Tokens stored deliberately (`sessionStorage` vs `localStorage` tradeoff understood)
- [ ] 401 handling clears session and redirects without leaking token values in logs/UI
- [ ] Protected routes check auth before rendering sensitive UI (`apps/app` loaders/guards)
- [ ] Admin vs client route separation enforced in the router, not only by hiding links
- [ ] No auth secrets or signing keys in the frontend

## Input & Output

- [ ] User input validated at form boundaries (Zod in `app` where used)
- [ ] String lengths and formats constrained before API calls
- [ ] HTML/markdown rendered safely (no unsanitized `dangerouslySetInnerHTML` / `innerHTML`)
- [ ] URLs validated before client-side redirects (open redirect)
- [ ] File uploads: type/size constrained in UI; never trust client-only checks as the only gate

## XSS / DOM

- [ ] Prefer framework escaping; avoid raw HTML injection
- [ ] Third-party widgets audited; load with `async`/`defer` and minimal permissions
- [ ] CSP considered for production (report-only → enforce)

## Headers / Transport (consume / configure where the FE owns it)

```
Content-Security-Policy: default-src 'self'; ...
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

- [ ] All API/WebSocket traffic over HTTPS/WSS in production
- [ ] CORS is a **server** concern — FE must not assume `*` is safe; call only known origins

## Data Protection (Client)

- [ ] Tokens and PII not logged to console in production
- [ ] Error toasts/UI show generic messages (no stack traces, no raw API internals)
- [ ] Sensitive query params not left in history longer than needed

## Dependency Security

This monorepo uses **pnpm** at the root.

```bash
pnpm install --frozen-lockfile
pnpm audit
```

- [ ] Exactly one authoritative lockfile at the workspace root (`pnpm-lock.yaml`)
- [ ] Nested `package-lock.json` in apps is not used for installs
- [ ] Critical/high advisories triaged for reachability
- [ ] New dependencies reviewed (ownership, maintenance, typosquatting)

## AI / LLM (if used in UI)

- [ ] Model output treated as untrusted — never into `eval` / `innerHTML` / navigation without validation
- [ ] Secrets kept out of prompts and client-visible config

## OWASP — Frontend Mapping

| Risk | Frontend focus |
|------|----------------|
| Broken Access Control | Route guards, hide ≠ protect; don't rely on UI alone |
| Cryptographic Failures | HTTPS; no secrets in public env |
| Injection | XSS via HTML/markdown; avoid unsafe sinks |
| Security Misconfiguration | CSP, public env hygiene |
| Vulnerable Components | `pnpm audit`, minimize deps |
| Auth Failures | Token storage, logout, 401 handling |
| SSRF | Prefer not fetching arbitrary user URLs from Next route handlers without allowlists |
