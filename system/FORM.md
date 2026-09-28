# Form

The form is the thing's body: what it looks like where it stands. You design it by hand and render it with an image model, in four steps you can repeat as often as you like. VoiceIt shows the form beside the screen and the light, and any behaviour can be played with any form.

## The loop

1. **Sketch** on paper: a three-quarter view of the thing, with the screen and the light where you want them. Photograph the sketch.
2. **Render** the photo into a product image with ChatGPT or Gemini (prompts below).
3. **Mark up** the render: print it or open it in any drawing app, and draw your changes over it in a strong colour, with short labels ("rounder", "screen lower", "fabric here").
4. **Re-render** from the marked-up image. Repeat 3 and 4 until the form is yours.

Save each form as one image in `design/forms/`, named after it (`lamp.png`, `bedside-unit.png`); the name appears in VoiceIt's Form menu. Keep sketches and earlier renders in `design/forms/process/`; VoiceIt only lists the images directly in `design/forms/`.

## Prompts

These work in ChatGPT (image generation) and Gemini (image editing). Upload the image, then paste the prompt and fill in the brackets.

**Sketch to render**

> Render this sketch as a realistic product photo of [a small bedside device with a screen and one light]. Keep the proportions, the position of the screen and the light, and every detail drawn in the sketch. Material: [e.g. matte white plastic and grey fabric]. Plain light grey background, soft studio light, three-quarter view, the whole product in frame, no text, no people, no room.

**Marked-up render to new render**

> This is a product render with changes drawn on top in [colour]. Apply only the marked changes: [list them, e.g. make the top edge rounder; move the screen lower; fabric on the front]. Keep everything that is not marked exactly as it is. Remove the markings. Same background, light and view.

**Variations** (when you are stuck)

> Show three variations of this device side by side that differ only in [e.g. how soft or hard the shape is]. Same background, light and view.

Tips:

- Change one or two things per step. Many changes at once make the model redraw the whole object.
- If the model drifts, go back to your last good render and mark up again.
- Keep the screen a plain dark or light rectangle. What it shows is designed in the screenplay, not in the render.
- The same form can carry different behaviours. Try yours in someone else's form, and theirs in yours.

Tutorial note: students who already have a Vizcom account may use it for the render steps; the procedure is the same.
