# Evolving Pointer

An interactive SVG dragon that follows pointer movement with a smooth segmented-body animation. The project uses plain HTML, CSS, and JavaScript with no runtime dependencies or build step.

## Features

- Responsive full-screen SVG animation
- Pointer and touch input through Pointer Events
- Dynamically generated dragon segments
- Responsive movement bounds after viewport changes
- Accessible title and description for the animated artwork

## Run Locally

Clone the repository and start any static file server from the project directory:

```bash
git clone https://github.com/Subham-KRLX/Evolving-Pointer.git
cd Evolving-Pointer
python3 -m http.server 4173
```

Open [http://localhost:4173](http://localhost:4173) and move the pointer around the page. On a touch device, drag across the screen.

## Project Structure

```text
.
|-- index.html   # SVG definitions and document metadata
|-- script.js    # Pointer tracking and animation loop
`-- style.css    # Full-screen layout and visual styling
```

## How It Works

The first point follows the current pointer position. Each remaining point follows the segment before it while preserving spacing and rotation. SVG `use` elements reuse the head, fin, and spine definitions so the animation stays compact and avoids duplicating path data.

## Browser Support

The experience works in current browsers that support SVG, Pointer Events, and `requestAnimationFrame`.
