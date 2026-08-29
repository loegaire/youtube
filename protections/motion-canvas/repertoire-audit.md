# Motion Repertoire Audit

This production directly imports `/home/thinh/proj/youtube/motion-repertoire/motion-canvas/src/choreography.ts`; it does not copy the repertoire into this project.

| Reused primitive | Where it is used | Why it is appropriate |
|---|---|---|
| `prepareEntrance` + `enterStage` | Every narration beat | Establishes a different camera-origin pose before a beat enters; avoids repeated dissolve-only changes. |
| `cameraTravel` | Every 3–5 second sub-beat | Gives source inspection, stack reconstruction, page permission, and loader mapping moments distinct push/track/rise/drop movement. |
| `cascadeIn` | Evidence rows and semantic nodes | Staggers structures into view so the viewer can form a causal order. |
| `drawPaths` | Overflow, instruction-fetch, process-map, base+offset, GOT-write, and final-layer routes | Makes relationships form over time instead of appearing as static arrows. |
| `trackedPoints` | ASLR main-to-libc tether | Keeps the relation attached as mappings move, so the diagram reads as a runtime relationship rather than a slide. |
| `exitStage` | Every beat seam | Provides directional exits that preserve the continuous camera-space feeling. |

The project intentionally does **not** reuse the repertoire's tool-surface/dashboard visual component. Its scene system uses the same choreography API with a quieter near-black evidence and diagram language, meeting the clean-frame constraint.
