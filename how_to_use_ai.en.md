# How To Use AI

## Purpose
This project is an AI-standardized development framework.
You can describe your requirement, and AI will implement code according to the framework's conventions.

## What To Tell AI
- Business goal: what you want to build or change.
- Scope: which page/module/API should be affected.
- Constraints: style, performance, compatibility, security, deadline.
- Acceptance criteria: what counts as done.

## Prompt Template
Use this template when asking AI:

```text
Goal:
Build/modify <feature>.

Context:
Project uses React + Vite + TypeScript.
Follow existing structure and coding style.

Requirements:
1. ...
2. ...
3. ...

Constraints:
- Do not break existing routes.
- Keep i18n and theme compatible.
- Add/adjust tests if needed.

Done Criteria:
- [ ] Feature works in dev mode.
- [ ] Build passes.
- [ ] Key files updated with clear diffs.
```

## Framework Rules
- Reuse existing modules before creating new ones.
- Keep UI text in i18n language files.
- Keep styles compatible with current theme variables.
- Prefer small, focused changes with clear file boundaries.
- Always verify with a build before finishing.

## Recommended Workflow
1. Describe requirement in one sentence.
2. Add must-have and must-not-have constraints.
3. Ask AI to list affected files first.
4. Ask AI to implement and verify.
5. Review diff and run final checks.
