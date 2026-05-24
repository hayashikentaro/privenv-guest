# MVP Scope

The initial `privenv-guest` scope is documentation only.

Future MVP behavior may include:

- reading `privenv.manifest.json`
- listing capabilities
- creating `EffectRequest` JSON
- validating request shape
- rejecting forbidden raw command, env, timeout, and secret fields in request params
- documenting protected, demo, and passthrough modes

## Non-Goals

- no runtime implementation yet
- no `package.json` yet
- no dependency installation yet
- no real secret access
- no `.env` reading
- no Host config reading
- no vault reading
- no browser session reading
- no passthrough implementation yet
- no transport implementation yet
