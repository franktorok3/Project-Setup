# Security

- Never commit service-role keys, API secrets, database passwords, or private tokens.
- Public keys may be used client-side only when the downstream service is protected by explicit policies.
- Supabase tables exposed through public keys require RLS.
- Report discovered secrets immediately and rotate them before removing them from history.
