---
workflow: faceless-explainer
flow: automation
storyboard: no
message: "printf did not get hacked: it followed a format recipe that untrusted input was allowed to write."
destination: youtube
aspect: 1920x1080
language: en
audience: beginner CTF and pwn learners
length: 705s
angle: mechanical, challenge-anchored explanation
voice: local-chatterbox-owner-reference
style_preset: terminal-machine
---

## Intent

A long-form, faceless cybersecurity education video explaining a C format-string
vulnerability through the supplied picoCTF-style wizard challenge. It should feel
like a physical machine being assembled: readable terminal code, blue memory cells,
orange format tokens, purple pointers, and decisive red write arrows.

## Assets

- ../vuln.c — challenge source of truth: global `sus`, unsafe `printf(buf)`, and the win condition.
- ../../voice.m4a — owner-provided voice reference to clone locally with Chatterbox-Turbo.
- ../bof1/audio/reference/voice-reference.wav — existing clean conditioning cut from the same owner recording.

## Customizations

- Reusable visual components: terminal frame, printf machine, memory rows, counter meter,
  exploit builder, win gate, checklist, and warning labels.
- No raw null bytes shown as terminal text; addresses appear as packed byte blocks.
- Final flag is explicitly a demo placeholder, never claimed as the live flag.

## Notes

- 16:9 YouTube canvas inferred from the workspace and absence of a different destination.
- Narration is planned for a local owner-voice clone; no hosted voice service is used.
