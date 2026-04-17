# Lychee link checker

Lychee is a Rust-based link checker. It is not installed as an npm package. It is run by GitHub Actions using the official action `lycheeverse/lychee-action`, wired up in `.github/workflows/a11y.yml` (Phase 9).

Local command (if lychee is installed via cargo or a system package manager):

```
lychee --no-progress --max-concurrency 8 './dist/**/*.html'
```

CI runs it automatically on every PR and push to main.
