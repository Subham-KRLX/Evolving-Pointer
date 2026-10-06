"use strict";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const SEGMENT_COUNT = 40;
const HEAD_INDEX = 1;
const FIN_INDEXES = new Set([8, 14]);
const FRAME_DURATION = 1000 / 60;
const MAX_FRAME_SCALE = 3;

const screen = document.getElementById("screen");
const segments = [];

let width = Math.max(window.innerWidth, 1);
let height = Math.max(window.innerHeight, 1);
let radiusLimit = 0;
let radius = 0;
let phase = Math.random();
let previousTimestamp = null;
let animationFrameId = null;

const pointer = { x: width / 2, y: height / 2 };

for (let index = 0; index < SEGMENT_COUNT; index += 1) {
  segments[index] = { element: null, x: width / 2, y: 0 };
}

const addSegment = (symbolId, index) => {
  const element = document.createElementNS(SVG_NAMESPACE, "use");
  element.setAttribute("href", `#${symbolId}`);
  segments[index].element = element;
  screen.prepend(element);
};

const createDragon = () => {
  for (let index = 1; index < SEGMENT_COUNT; index += 1) {
    if (index === HEAD_INDEX) addSegment("Cabeza", index);
    else if (FIN_INDEXES.has(index)) addSegment("Aletas", index);
    else addSegment("Espina", index);
  }
};

const trackPointer = ({ clientX, clientY }) => {
  pointer.x = clientX;
  pointer.y = clientY;
  radius = 0;
};

const resize = () => {
  width = Math.max(window.innerWidth, 1);
  height = Math.max(window.innerHeight, 1);
  radiusLimit = Math.max(0, Math.min(width, height) / 2 - 20);
  radius = Math.min(radius, radiusLimit);
  pointer.x = Math.min(Math.max(pointer.x, 0), width);
  pointer.y = Math.min(Math.max(pointer.y, 0), height);
};

const adjustedEasing = (strength, frameScale) =>
  1 - Math.pow(1 - strength, frameScale);

const animate = (timestamp) => {
  animationFrameId = requestAnimationFrame(animate);

  const elapsed = previousTimestamp === null ? FRAME_DURATION : timestamp - previousTimestamp;
  const frameScale = Math.min(Math.max(elapsed / FRAME_DURATION, 0), MAX_FRAME_SCALE);
  const leaderEasing = adjustedEasing(0.1, frameScale);
  const segmentEasing = adjustedEasing(0.25, frameScale);
  const centeringEasing = adjustedEasing(0.05, frameScale);
  previousTimestamp = timestamp;

  const leader = segments[0];
  const offsetX = (Math.cos(3 * phase) * radius * width) / height;
  const offsetY = (Math.sin(4 * phase) * radius * height) / width;

  leader.x += (offsetX + pointer.x - leader.x) * leaderEasing;
  leader.y += (offsetY + pointer.y - leader.y) * leaderEasing;

  for (let index = 1; index < SEGMENT_COUNT; index += 1) {
    const segment = segments[index];
    const previous = segments[index - 1];
    const angle = Math.atan2(segment.y - previous.y, segment.x - previous.x);

    segment.x +=
      (previous.x - segment.x + (Math.cos(angle) * (100 - index)) / 5) *
      segmentEasing;
    segment.y +=
      (previous.y - segment.y + (Math.sin(angle) * (100 - index)) / 5) *
      segmentEasing;

    const scale = (162 + 4 * (1 - index)) / 50;
    const rotation = (180 / Math.PI) * angle;
    const translateX = (previous.x + segment.x) / 2;
    const translateY = (previous.y + segment.y) / 2;

    segment.element.setAttribute(
      "transform",
      `translate(${translateX},${translateY}) rotate(${rotation}) scale(${scale})`
    );
  }

  radius = Math.min(radius + frameScale, radiusLimit);
  phase += 0.003 * frameScale;

  if (radius > 60) {
    pointer.x += (width / 2 - pointer.x) * centeringEasing;
    pointer.y += (height / 2 - pointer.y) * centeringEasing;
  }
};

const startAnimation = () => {
  if (animationFrameId !== null) return;

  previousTimestamp = null;
  animationFrameId = requestAnimationFrame(animate);
};

const stopAnimation = () => {
  if (animationFrameId === null) return;

  cancelAnimationFrame(animationFrameId);
  animationFrameId = null;
  previousTimestamp = null;
};

const handleVisibilityChange = () => {
  if (document.hidden) stopAnimation();
  else startAnimation();
};

window.addEventListener("pointermove", trackPointer);
window.addEventListener("resize", resize);
document.addEventListener("visibilitychange", handleVisibilityChange);

resize();
createDragon();
startAnimation();
