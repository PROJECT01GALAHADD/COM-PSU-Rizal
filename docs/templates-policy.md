# templates policy

This project includes a `templates/` directory containing prebuilt resources. Treat it as a read-only library.

## goals

- **reuse**: copy only minimal files needed into the live app.
- **stability**: prevent template type/lint errors from affecting builds.

## rules

- **do not import at runtime** from `templates/`.
- **copy minimally** into `app/`, `components/`, `lib/`, etc.
- **prefer reuse** of existing primitives under `components/ui/` and `components/auth/`.
- **exclude tooling**: `templates/**` is excluded in `tsconfig.json`, `.eslintignore`, and `.vscode/settings.json`.

## workflow

1. cascade proposes a precise file list and targets.
2. qwen copies those files from `templates/` to targets.
3. cascade adapts imports and verifies build.
