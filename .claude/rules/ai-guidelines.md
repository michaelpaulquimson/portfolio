# AI Coding Guidelines (Karpathy)

Behavioral guidelines to reduce common LLM coding mistakes.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding
- State assumptions explicitly — if uncertain, ask
- If multiple interpretations exist, present them — don't pick silently
- If a simpler approach exists, say so — push back when warranted
- If something is unclear, stop, name what's confusing, and ask

## 2. Simplicity First
- No features beyond what was asked
- No abstractions for single-use code
- No error handling for impossible scenarios
- If you write 200 lines and it could be 50, rewrite it

Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes
- Don't "improve" adjacent code, comments, or formatting
- Don't refactor things that aren't broken
- Match existing style, even if you'd do it differently
- If you notice unrelated dead code, mention it — don't delete it
- Remove only imports/variables/functions YOUR changes made unused

Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution
- Define verifiable success criteria before coding
- For multi-step tasks, state a brief plan with verify steps
- Test-first for bug fixes: write a test that reproduces the bug, then fix it

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation.
