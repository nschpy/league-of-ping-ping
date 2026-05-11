---
name: design-handoff-required
description: Enforces using the design handoff archive as the source of truth. Use only when the user explicitly asks to use "дизайн-файл", "design-file" or "design file".
user-invocable: false
---

# Design Handoff Required

## Core rule
Нужно использовать файл с дизайном, когда просят реализовать часть какого-то функционала из дизайн-файла: Read the file `./league-of-tennis.zip` and the README inside.

## When to apply

Apply this skill when the task references:
- design file implementation
- handoff-based UI work
- mockup-to-code work
- feature behavior defined by design artifacts

## Required workflow

1. Read and inspect `/Users/frvmi/Downloads/League of Tennis-handoff.zip` before writing implementation code.
2. Treat values from the handoff (layout, spacing, typography, colors, states, interactions, copy) as the source of truth.
3. If a requirement is missing in code but present in the handoff, follow the handoff.
4. If the archive is unavailable or unclear, stop and ask for clarification instead of guessing.

## Constraints

- Do not implement design-driven functionality without consulting the handoff archive.
- Do not replace explicit design values with assumptions.
- In the final implementation summary, mention that the handoff archive was used.
