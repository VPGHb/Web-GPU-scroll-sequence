# GPU Scroll Sequence

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-c2cabb?style=for-the-badge&logo=githubpages&logoColor=111111)](https://vpghb.github.io/GPU-scroll-sequence/)
[![Repository](https://img.shields.io/badge/Repository-GitHub-111111?style=for-the-badge&logo=github&logoColor=white)](https://github.com/VPGHb/GPU-scroll-sequence)
[![Created by Vraj Patel](https://img.shields.io/badge/Created%20by-Vraj%20Patel-f7f8ff?style=for-the-badge)](https://github.com/VPGHb)

A standalone product-style scroll experience created by Vraj Patel. The motion frames were generated with Google Flow, sliced into an image sequence, and rebuilt as a web experience with HTML, CSS, GSAP, ScrollTrigger, and canvas rendering.

Credit and inspiration: [Cindy Zhu's 5K scroll animation guide](https://cindyzhu.com.au/guides/5k-scroll-animation).

![HTML](https://img.shields.io/badge/HTML5-111111?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-111111?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-111111?style=for-the-badge&logo=javascript&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-111111?style=for-the-badge&logo=greensock&logoColor=88ce02)
![Google Flow](https://img.shields.io/badge/Google%20Flow-111111?style=for-the-badge&logo=google&logoColor=white)

## Live Demo

After publishing with GitHub Pages, the site will be available here:

[https://vpghb.github.io/GPU-scroll-sequence/](https://vpghb.github.io/GPU-scroll-sequence/)

## Overview

This project turns a short AI-generated product motion clip into an Apple-style scroll sequence. Instead of playing a normal video, the site preloads individual frames and maps scroll progress to the frame index on a canvas.

The page also includes a parallax intro, sticky walkthrough copy, interactive product cards, and a pinned scroll-scrub sequence.

## Features

- Scroll-linked canvas image sequence
- GSAP ScrollTrigger pinning and scrub timing
- Parallax lead-in section
- Sticky feature walkthrough
- Interactive product cards with hover and tap states
- Mobile responsive layout
- Reduced motion support for card interactions
- Clean frame asset folder instead of embedded base64

## How I Created This

### 1. Generate two frames in Google Flow

Go to [labs.google/flow](https://labs.google/flow) and generate two images from a text prompt:

- A start frame showing how the animation begins
- An end frame showing how the animation ends

The subject, camera angle, lighting, background, and framing should stay consistent between both frames. Only the thing you want to animate should change.

Note: Whisk shut down in April 2026 and merged into Flow, so this workflow uses Flow.

### 2. Animate the in-between with Frames to Video

Still in Flow, choose `Frames to Video: First + last`, upload both images, and add a short motion prompt such as:

```text
slow smooth 360 rotation
```

Flow/Veo generates the in-between motion. Download the resulting clip.

### 3. Slice the clip into frames in EZGIF

Go to [ezgif.com/video-to-jpg](https://ezgif.com/video-to-jpg), choose `Video to JPG (image sequence)`, set it to `30fps`, convert the clip, then click `Download frames as ZIP`.

After unzipping, you should have a numbered folder of images, one image per frame.

### 4. Hand the folder to an AI coding tool

Drop the frame folder into an AI coding tool such as Claude Code, Cursor, Antigravity, or Codex, then ask it to build a scroll-linked canvas image sequence with GSAP and ScrollTrigger.

That tool can write the code that preloads the frames, pins the canvas, and maps scroll progress to the current frame.

## Image Prompts

The first step is the most important. The trick is to keep both prompts almost word-for-word identical except for the one visual change: assembled versus taken apart. That keeps the product, camera, and lighting consistent across both frames.

### Start Frame: Product Assembled

```text
High-end studio product photograph of [YOUR PRODUCT], fully assembled and intact, floating dead center against a seamless matte light-grey studio background. Straight-on view, perfectly level camera, soft even studio lighting, one subtle soft shadow directly beneath the product, photorealistic, ultra sharp, high detail. Keep the product small enough in frame that there is generous empty space on every side. No text, no watermark, no hands, no props, no brand logos. Landscape 16:9.
```

### End Frame: Product Taken Apart

```text
High-end studio product photograph of the same [YOUR PRODUCT] as a clean exploded view: the outer shell or casing lifted apart and every major part and layer separated and floating in an organized, evenly spaced arrangement along one axis, like a technical teardown render. Same straight-on view, same perfectly level camera, same soft even studio lighting, same seamless matte light-grey studio background, one subtle soft shadow beneath. The core body of the product stays in the exact center at the same size, with the parts spreading outward around it. Photorealistic, ultra sharp, high detail. No text, no watermark, no hands, no props, no brand logos. Landscape 16:9.
```

Replace `[YOUR PRODUCT]` with anything: a graphics card, smartphone, mechanical watch, film camera, espresso machine, sneaker, or another product.

For the end frame, name the 4 to 6 parts you want visible. For example:

- Phone: battery, circuit board, camera module, speaker, tiny screws
- Sneaker: outsole, midsole, insole, upper, laces
- Espresso machine: boiler, portafilter, pump, casing panels
- GPU: fans, heatsink, shroud, circuit board, backplate, screws

The phrase `exploded view` is important because it is the technical term for pulled-apart product renders.

## Consistency Tips

- Generate the start frame first and only move on once you like it.
- If Flow lets you reference or reuse the first image when generating the end frame, do that.
- If the start and end frames look like different products, regenerate the end frame before making the video.
- A retry during image generation is easier than trying to fix mismatched frames later.

## Motion Prompt

For a teardown-style animation, use a motion prompt like this:

```text
The product slowly comes apart into an exploded view: the casing separates and the internal parts spread outward smoothly and evenly. Camera locked in place, background unchanged.
```

## Project Structure

```text
.
|-- assets/
|   `-- frames/
|       |-- frame-001.jpg
|       |-- frame-002.jpg
|       `-- ...
|-- css/
|   `-- style.css
|-- js/
|   `-- main.js
|-- index.html
`-- README.md
```

## Publish With GitHub Pages

1. Open this folder in GitHub Desktop.
2. Click `Publish repository` and publish it as `GPU-scroll-sequence`.
3. On GitHub, open the repository settings.
4. Go to `Pages`.
5. Set the source to `Deploy from a branch`.
6. Choose branch `main` and folder `/root`.
7. Save and wait for GitHub Pages to deploy.

The expected public URL is:

```text
https://vpghb.github.io/GPU-scroll-sequence/
```

## Run Locally

Use a local server so the browser can load the frame files correctly:

```bash
python -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000/
```

## Replacing Frames

Replace the files inside `assets/frames` with a numbered sequence using the same pattern:

```text
frame-001.jpg
frame-002.jpg
frame-003.jpg
```

If the frame count changes, update `FRAME_COUNT` and `FRAME_EXT` in `js/main.js`.

Recommended exports:

- 16:9 aspect ratio
- 1280x720 or 1920x1080
- WebP or high-quality JPG sequence
- Numbered individual frames, not one animated WebP