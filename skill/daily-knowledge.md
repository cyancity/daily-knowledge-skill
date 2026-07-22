# Daily Knowledge Persistence

You are running with the daily-knowledge skill. Follow these rules automatically without being asked.

## Activation Guard (check first, every conversation)

Before doing anything, check the current working directory:

1. Is CWD inside a git repository (`.git` exists in CWD or any parent)?
2. Does that repository root contain an `AGENTS.md` file?

If BOTH are true: **this skill does NOT activate.** The project's dev harness (`docs/histories/`) handles persistence. Stop here.

If either is false: **this skill activates.** Proceed with the lifecycle below.

## When This Applies

This skill applies to NON-DEVELOPMENT conversations: learning, Q&A, daily problem-solving, research, brainstorming, decision-making.

## Lifecycle

### On Conversation Start (init)

Create a new knowledge file immediately:

- Path: `~/Workspace/knowledge-base/YYYY-MM/YYYYMMDD-HHmm-topic-slug.md`
- Create the `YYYY-MM/` directory if it does not exist.
- `topic-slug`: 2-4 word kebab-case summary of the conversation topic.
- Write the initial header with Obsidian-compatible YAML frontmatter:

```markdown
---
date: YYYY-MM-DD
time: HH:mm
agent: <agent name>
tags:
  - tag1
  - tag2
type: daily
---

# <Topic Title>
```

### Every 5 User Turns (auto-save)

After every 5th user message, append a checkpoint to the file. Do NOT wait for the user to ask. Do NOT announce that you are saving.

### On Conversation End

Append a final summary section before the conversation closes.

## What To Save (filter rules)

### SAVE these:

- The user's original question or problem statement (paraphrased concisely).
- Conclusions, decisions, or answers reached.
- Key reasoning or tradeoff analysis that led to a decision.
- Action items or next steps identified.
- New concepts, frameworks, or mental models introduced.
- Comparisons between options with a final choice.
- Errors encountered and their root causes.

### SKIP these (noise filter):

- Greetings, small talk, "ok", "thanks", "continue".
- Pure formatting requests ("make it a table", "translate this").
- Repeated questions that were already answered in the same file.
- Intermediate failed attempts that did not lead anywhere.
- Raw tool output, command logs, or verbose stack traces (summarize in one line instead).
- Content already captured in a previous checkpoint (do not duplicate).

### Compression rule:

If 5 turns contain only 1 substantive exchange, save only that one. If all 5 turns are noise, write a single line: `> [checkpoint skipped: no substantive content]`

## Checkpoint Format

```markdown
## Checkpoint N (turn X-Y)

**Q:** <user's question or topic, 1-2 sentences>

**A:** <conclusion or answer, 2-5 sentences>

**Actions:** <if any>
```

## Final Summary Format

```markdown
## Summary

<3-5 bullet points capturing the most important takeaways from the entire conversation>

## Open Questions

<unresolved items, if any. Omit this section if none.>
```

## Rules

- Never ask permission to save. Just do it.
- Never announce "I'm saving to knowledge base" to the user.
- Redact secrets, tokens, passwords, and machine-specific paths.
- One conversation = one file. Never merge into an existing file from a different conversation.
- If unsure whether content is substantive, err on the side of saving a shorter version rather than skipping entirely.
- Use Obsidian wiki-links `[[YYYYMMDD-HHmm-topic-slug]]` to reference related previous notes when a topic connects to an earlier conversation.
- Tags in frontmatter should be lowercase, hyphenated (e.g. `agent-workflow`, `llm-infra`).
