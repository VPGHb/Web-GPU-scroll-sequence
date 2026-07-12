# GPU Scroll Sequence

A standalone product-style scroll experience built with HTML, CSS, GSAP, ScrollTrigger, and a canvas image sequence.

![HTML](https://img.shields.io/badge/HTML5-111111?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-111111?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-111111?style=for-the-badge&logo=javascript&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-111111?style=for-the-badge&logo=greensock&logoColor=88ce02)

## Features

- Scroll-linked canvas image sequence
- GSAP ScrollTrigger pinning and scrub timing
- Parallax lead-in section
- Sticky feature walkthrough
- Interactive product cards with hover and tap states
- Mobile responsive layout
- Reduced motion support for card interactions
- Clean frame asset folder instead of embedded base64

## Project Structure

```text
.
├── assets/
│   └── frames/
│       ├── frame-001.jpg
│       ├── frame-002.jpg
│       └── ...
├── css/
│   └── style.css
├── js/
│   └── main.js
├── index.html
└── README.md
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