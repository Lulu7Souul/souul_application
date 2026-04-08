# Lulu — Voice System
> Status: LOCKED. Date: 2026-04-08.

## Three Voice Modes (per child profile)

| Mode | What it is | How it works |
|---|---|---|
| **Parent voice** | Parent records their own voice per step | Browser mic → upload to Supabase Storage → plays on step load |
| **Lulu voice** | Built-in warm voice reads the step instruction | Web Speech API (V1) → ElevenLabs (V2 upgrade) |
| **Off** | No voice — visuals and music only | Audio cue still plays if set, but no spoken words |

## Voice setting lives on the child profile — set once, applies everywhere.
## Can be overridden per sequence or per step.

## V1 Built-in Voice: Web Speech API
- Free, no API key, works in all modern browsers
- Parent picks from available warm/calm system voices on their device
- Lulu filters to show only voices that meet a "calm tone" heuristic (female/neutral, slower rate)
- Rate: 0.85 (slightly slower than default — better for early years comprehension)
- Pitch: 1.0 (neutral)
- Volume: 0.9

## V2 Built-in Voice: ElevenLabs
- 3-4 curated warm, calm voice characters
- Named voices: e.g. "Lulu Classic", "Lulu Soft", "Lulu Warm"
- Pre-generated per step text and cached in Supabase Storage

## What Lulu's voice says on each step
- The step's **voice script** field (adult writes what Lulu should say — e.g. "Time to put on your shoes!")
- Falls back to step title if no script written
- For parent voice mode: parent records the script themselves

## Audio playback sequence on step load
1. Step visual appears
2. 300ms pause
3. Voice plays (if mode is not off)
4. Music cue plays after voice completes (if set)
5. Timer starts (if set)
