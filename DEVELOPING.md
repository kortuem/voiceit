# Developing VoiceIt

VoiceIt is a small static browser application with two Node command-line helpers. There is no application backend, database, package installation or AI-provider integration in this repository. AI can help author scripts or change the tool, but is not part of playback.

## Code map

| File | Responsibility |
| --- | --- |
| `index.html` | Sends the root URL to the player page. |
| `system/voiceit.html` | Interface, styling, browser speech and sound, playback, local-file selection and refresh. The JavaScript is inline. |
| `system/voiceit.js` | Shared parsing, validation, casting, timing and design-file model, used by both the browser and checker. |
| `system/VOCABULARY.md` | Machine-readable vocabulary for screens, lights, sounds, voices and manner. This is runtime input, not just prose. |
| `system/SCREENPLAY.md` | Author-facing notation reference. |
| `system/bin/preview` | Node HTTP server on loopback, local file listing and browser launch. |
| `system/bin/check` | Command-line validation of scripts against the shared parser and vocabulary. |
| `system/test/voiceit.test.js` | Parser, checker, source-consistency and local-server boundary tests. |
| `examples/index.json` | File inventory used when loading examples from the static hosted edition. |

`design/` belongs to the person using a clone or download. Do not overwrite their work. `system/operations/` and `AGENTS.md` describe how an optional coding assistant should help with it; they are not a hosted agent service.

## Run and check locally

Use Node.js 18 or newer, from the repository root:

```sh
node system/bin/preview
node system/bin/check
node --test system/test/voiceit.test.js
```

The preview opens a browser and listens on `127.0.0.1`, normally port 4307. Use `--port 4400` to select another port or `--no-open` to suppress browser launch. It tries successive ports if one is occupied. Stop it with Ctrl+C. There is no npm install or build step.

The checker validates the examples and your own scripts. In a fresh copy, its warning about having no forms of your own is expected. Tests start a temporary loopback server for the file-boundary checks; they need no VM, external service, account or paid API call.

Tests do not prove audible speech quality or every browser's folder permissions. After changes affecting playback, listen to examples, check pause/restart/step, and test the affected local and hosted-folder workflows. Record untested platforms rather than claiming compatibility.

## Keep the editions consistent

The local preview supplies `design.json`. The hosted edition loads the bundled examples and can read a user-selected local folder. It cannot execute someone's changed tool code or the Node checker. Browser capabilities determine whether a selected folder can be followed or must be opened again.

- Keep parser/checker behaviour aligned through `system/voiceit.js`.
- Keep step 1 of `TUTORIAL.md` and the Setup tab's `setupSteps` copy identical; an existing test checks their wording.
- When adding examples, update `examples/index.json`.
- Treat vocabulary changes as functional changes and test affected scripts.
- Do not change version numbers, cache keys, tags or hosting settings as part of an unrelated documentation edit. Release changes follow the maintainer's process in `CHANGELOG.md`.

## Contributing

For a problem report, use [GitHub Issues](https://github.com/kortuem/voiceit/issues) with the version, browser, operating system, expected behaviour and smallest fictional example that reproduces it. Never attach private client or student material.

For a change, use a separate branch or fork, explain the purpose and scope, run the applicable checks, and open a pull request. Keep documentation changes separate from behaviour changes where possible. Do not include your own `design/` project unless you deliberately prepared it as a shareable example. Passing checks is not permission to publish or alter a frozen teaching release.
