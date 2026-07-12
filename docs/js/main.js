const FRAME_COUNT = 50;
const FRAME_DIR = "assets/frames";
const FRAME_EXT = "jpg";

const frameSources = Array.from({ length: FRAME_COUNT }, (_, index) => `${FRAME_DIR}/frame-${String(index + 1).padStart(3, "0")}.${FRAME_EXT}`);

const canvas = document.getElementById("sequence-canvas");
const context = canvas.getContext("2d", { alpha: false });
const loader = document.getElementById("loader");
const loaderLabel = document.getElementById("loader-label");
const loaderBar = document.getElementById("loader-bar");
const frameLabel = document.getElementById("frame-label");
const progressBar = document.getElementById("progress-bar");
const parallaxProduct = document.getElementById("parallax-product");
const walkthroughFrame = document.getElementById("walkthrough-frame");
const walkthroughStepLabel = document.getElementById("walkthrough-step-label");
const walkthroughTitle = document.getElementById("walkthrough-title");
const sequenceLeadImage = document.getElementById("sequence-lead-image");

const sequenceState = { frame: 0 };
const images = [];
let currentFrame = 0;
let canvasWidth = 0;
let canvasHeight = 0;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function imageAt(index) {
  return frameSources[clamp(index, 0, frameSources.length - 1)];
}

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = Math.round(canvasWidth * dpr);
  canvas.height = Math.round(canvasHeight * dpr);
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;
  context.setTransform(dpr, 0, 0, dpr, 0, 0);
  renderFrame(currentFrame);
}

function drawCover(image) {
  if (!image || !image.complete) return;
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const canvasRatio = canvasWidth / canvasHeight;
  let drawWidth = canvasWidth;
  let drawHeight = canvasHeight;

  if (imageRatio > canvasRatio) {
    drawWidth = canvasHeight * imageRatio;
  } else {
    drawHeight = canvasWidth / imageRatio;
  }

  const x = (canvasWidth - drawWidth) / 2;
  const y = (canvasHeight - drawHeight) / 2;
  context.fillStyle = "#000";
  context.fillRect(0, 0, canvasWidth, canvasHeight);
  context.drawImage(image, x, y, drawWidth, drawHeight);
}

function renderFrame(index) {
  currentFrame = clamp(Math.round(index), 0, images.length - 1);
  drawCover(images[currentFrame]);
  if (frameLabel) frameLabel.textContent = `Frame ${String(currentFrame + 1).padStart(3, "0")}`;
}

function updateLoader(loaded, total) {
  const progress = total ? loaded / total : 0;
  loaderLabel.textContent = `Loading frames ${Math.round(progress * 100)}%`;
  loaderBar.style.transform = `scaleX(${progress})`;
}

function preloadFrames() {
  let loaded = 0;
  let failed = 0;
  const total = frameSources.length;
  updateLoader(0, total);

  return new Promise((resolve) => {
    frameSources.forEach((source, index) => {
      const image = new Image();
      image.decoding = "async";
      image.onload = () => {
        loaded += 1;
        updateLoader(loaded, total);
        if (loaded + failed === total) resolve({ loaded, failed });
      };
      image.onerror = () => {
        failed += 1;
        if (loaded + failed === total) resolve({ loaded, failed });
      };
      image.src = source;
      images[index] = image;
    });
  });
}

function setActiveWalkthroughStep(step, index) {
  const steps = gsap.utils.toArray(".walkthrough-step");

  steps.forEach((item) => {
    const active = item === step;
    item.classList.toggle("is-active", active);
    gsap.to(item, {
      autoAlpha: active ? 1 : 0.48,
      x: active ? 0 : -18,
      scale: active ? 1 : 0.985,
      duration: 0.34,
      ease: "power2.out",
      overwrite: true
    });
  });

  if (walkthroughStepLabel) walkthroughStepLabel.textContent = step.dataset.step || String(index + 1).padStart(2, "0");
  if (walkthroughTitle) walkthroughTitle.textContent = step.dataset.title || "";

  const nextFrame = imageAt(8 + index * 16);
  if (walkthroughFrame && walkthroughFrame.src !== nextFrame) {
    gsap.to(walkthroughFrame, {
      autoAlpha: 0,
      scale: 0.94,
      duration: 0.16,
      ease: "power2.out",
      overwrite: true,
      onComplete: () => {
        walkthroughFrame.src = nextFrame;
        gsap.to(walkthroughFrame, { autoAlpha: 1, scale: 1, duration: 0.34, ease: "back.out(1.35)", overwrite: true });
      }
    });
  }

  gsap.to(".walkthrough-visual", {
    scale: 1 + index * 0.018,
    rotate: index === 1 ? -1.2 : index === 2 ? 1.2 : 0,
    boxShadow: index === 0 ? "0 36px 110px rgba(0,0,0,.62)" : "0 42px 128px rgba(0,0,0,.72)",
    duration: 0.45,
    ease: "power2.out",
    overwrite: true
  });

  gsap.to(".walkthrough-orbit", {
    rotate: index * 118,
    duration: 0.75,
    ease: "power2.out",
    overwrite: true
  });
}

function initWalkthrough() {
  const section = document.querySelector(".walkthrough-section");
  const steps = gsap.utils.toArray(".walkthrough-step");
  if (!section || !steps.length) return;

  if (walkthroughFrame) {
    walkthroughFrame.src = imageAt(8);
    gsap.set(walkthroughFrame, { autoAlpha: 1, scale: 1 });
  }

  gsap.set(steps, { autoAlpha: 0.48, x: -18, scale: 0.985 });
  setActiveWalkthroughStep(steps[0], 0);

  steps.forEach((step, index) => {
    ScrollTrigger.create({
      trigger: step,
      start: "top 62%",
      end: "bottom 38%",
      onEnter: () => setActiveWalkthroughStep(step, index),
      onEnterBack: () => setActiveWalkthroughStep(step, index)
    });

    gsap.fromTo(step,
      { y: 42, filter: "blur(8px)" },
      {
        y: 0,
        filter: "blur(0px)",
        ease: "none",
        scrollTrigger: {
          trigger: step,
          start: "top 86%",
          end: "top 54%",
          scrub: 0.5
        }
      }
    );
  });

  gsap.fromTo(".walkthrough-visual",
    { y: 40, autoAlpha: 0, scale: 0.94 },
    {
      y: 0,
      autoAlpha: 1,
      scale: 1,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top 82%",
        end: "top 34%",
        scrub: 0.7
      }
    }
  );
}

function initProductCards() {
  const cards = gsap.utils.toArray(".product-card");
  if (!cards.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hoverless = window.matchMedia("(hover: none), (pointer: coarse)").matches;

  cards.forEach((card) => {
    const image = card.querySelector(".product-card-image");
    const cta = card.querySelector(".product-card-cta");
    const frameIndex = Number(image?.dataset.frameIndex || 0);
    if (image) image.src = imageAt(frameIndex);

    if (reduceMotion) {
      if (cta) gsap.set(cta, { autoAlpha: 1, y: 0 });
      if (cta) cta.style.pointerEvents = "auto";
      if (image) gsap.set(image, { scale: 1 });
      return;
    }

    gsap.set(cta, { autoAlpha: 0, y: 10 });
    gsap.set(image, { scale: 1 });
  });

  if (reduceMotion) return;

  const activateCard = (card) => {
    const image = card.querySelector(".product-card-image");
    const cta = card.querySelector(".product-card-cta");
    card.classList.add("is-tapped");
    gsap.to(card, { y: -10, boxShadow: "0 34px 92px rgba(0, 0, 0, 0.58)", duration: 0.48, ease: "back.out(1.45)" });
    gsap.to(image, { scale: 1.045, duration: 0.55, ease: "power3.out" });
    gsap.to(cta, { autoAlpha: 1, y: 0, duration: 0.32, ease: "power2.out" });
  };

  const deactivateCard = (card) => {
    const image = card.querySelector(".product-card-image");
    const cta = card.querySelector(".product-card-cta");
    card.classList.remove("is-tapped");
    gsap.to(card, { y: 0, boxShadow: "0 18px 54px rgba(0, 0, 0, 0.34)", duration: 0.36, ease: "power2.out" });
    gsap.to(image, { scale: 1, duration: 0.42, ease: "power2.out" });
    gsap.to(cta, { autoAlpha: 0, y: 10, duration: 0.24, ease: "power2.out" });
  };

  if (hoverless) {
    cards.forEach((card) => {
      card.addEventListener("click", (event) => {
        if (event.target.closest("a")) return;
        const isActive = card.classList.contains("is-tapped");
        cards.forEach((item) => { if (item !== card) deactivateCard(item); });
        if (isActive) deactivateCard(card); else activateCard(card);
      });
    });
    return;
  }

  cards.forEach((card) => {
    card.addEventListener("pointerenter", () => activateCard(card));
    card.addEventListener("pointerleave", () => deactivateCard(card));
    card.addEventListener("focusin", () => activateCard(card));
    card.addEventListener("focusout", (event) => { if (!card.contains(event.relatedTarget)) deactivateCard(card); });
  });
}


function initSequenceLead() {
  const lead = document.getElementById("sequence-lead");
  if (!lead) return;
  if (sequenceLeadImage) sequenceLeadImage.src = imageAt(0);

  gsap.fromTo(sequenceLeadImage,
    { autoAlpha: 0.18, scale: 1.12 },
    {
      autoAlpha: 0.42,
      scale: 1.02,
      ease: "none",
      scrollTrigger: {
        trigger: lead,
        start: "top bottom",
        end: "bottom top",
        scrub: 0.8
      }
    }
  );

  gsap.fromTo(".sequence-lead-copy",
    { y: 30, autoAlpha: 0 },
    {
      y: 0,
      autoAlpha: 1,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: {
        trigger: lead,
        start: "top 62%",
        toggleActions: "play none none reverse"
      }
    }
  );
}
function initParallax() {
  const section = document.getElementById("parallax-section");
  if (!section) return;
  if (parallaxProduct) parallaxProduct.src = imageAt(12);

  const media = gsap.matchMedia();
  media.add("(min-width: 721px)", () => {
    const timeline = gsap.timeline({ scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.85, invalidateOnRefresh: true } });
    timeline.to(".parallax-bg", { yPercent: 9, scale: 1.055, ease: "none" }, 0).to(".parallax-product-wrap", { yPercent: -13, xPercent: 3, rotate: 1.2, ease: "none" }, 0).to(".parallax-copy", { yPercent: -7, ease: "none" }, 0);
  });
  media.add("(max-width: 720px)", () => {
    const timeline = gsap.timeline({ scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.85, invalidateOnRefresh: true } });
    timeline.to(".parallax-bg", { yPercent: 6, scale: 1.035, ease: "none" }, 0).to(".parallax-product-wrap", { yPercent: -7, ease: "none" }, 0).to(".parallax-copy", { yPercent: -3, ease: "none" }, 0);
  });
}

async function initSequence() {
  if (!window.gsap || !window.ScrollTrigger) {
    document.body.classList.add("has-load-error");
    loaderLabel.textContent = "GSAP failed to load";
    return;
  }

  const result = await preloadFrames();
  if (!result.loaded) {
    document.body.classList.add("has-load-error");
    loaderLabel.textContent = "Frames failed to load";
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  initParallax();
  initWalkthrough();
  initProductCards();
  resizeCanvas();
  loader.classList.add("is-hidden");

  gsap.fromTo(".sequence-pin",
    { autoAlpha: 0.001, scale: 1.015 },
    {
      autoAlpha: 1,
      scale: 1,
      ease: "none",
      scrollTrigger: {
        trigger: "#sequence-section",
        start: "top 82%",
        end: "top top",
        scrub: 0.7
      }
    }
  );

  gsap.to(sequenceState, {
    frame: images.length - 1,
    ease: "none",
    snap: { frame: 1 },
    scrollTrigger: {
      trigger: "#sequence-section",
      start: "top top",
      end: "+=420%",
      pin: ".sequence-pin",
      scrub: 0.6,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => { progressBar.style.transform = `scaleX(${self.progress})`; }
    },
    onUpdate: () => renderFrame(sequenceState.frame)
  });

  window.addEventListener("resize", () => {
    resizeCanvas();
    ScrollTrigger.refresh();
  });
}

initSequence();