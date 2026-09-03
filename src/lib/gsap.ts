"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * The single place GSAP is configured. Plugins get registered here and
 * nowhere else (TZ.md Часть B §1) — scattered `registerPlugin` calls pull
 * the plugin into whichever chunk happens to run first, which is how
 * ScrollTrigger ends up in bundles that never scroll.
 *
 * Always animate through `useGSAP` rather than a bare useEffect: it scopes
 * the animation and reverts it on unmount, which is what stops React
 * StrictMode's double mount from leaving a duplicate ScrollTrigger behind
 * (TZ.md Часть B §16).
 */
gsap.registerPlugin(ScrollTrigger, useGSAP);

export { gsap, ScrollTrigger, useGSAP };
