/**
 * The eight scroll-story scenes, verbatim from TZ.md Часть C §3.
 *
 * Order matters and is REVIEW.md §1's, not DESIGN.md's: Voice is scene 7
 * and "Snap. Done." is the finale that hands the reader to the catalogue.
 * The `at`/`until` percentages are where each scene sits on the 800vh
 * master timeline — T8 pins to them; T5 only renders the copy statically.
 *
 * TZ.md's style note applies: the full stops in "Snap. Done." are
 * deliberate, and the verb-first headings are a set — change them all or
 * none.
 */
export type StoryScene = {
  id: string;
  /** Master-timeline window, in percent. */
  at: number;
  until: number;
  heading: string;
  body: string;
  /**
   * The still that stands in for this scene where the live deck does not
   * run — a frame captured from the real 3D scene at this scene's own
   * pose. `name` is the file stem in public/posters/.
   */
  poster: { name: string; alt: string };
  /** Only the finale carries a call to action. */
  cta?: { label: string; href: string };
};

export const STORY_SCENES: readonly StoryScene[] = [
  {
    id: "meet",
    at: 0,
    until: 10,
    heading: "Meet MODU.",
    body: "One deck on your desk. It runs your apps, your calls, your music.",
    poster: {
      name: "hero",
      alt: "The four MODU modules joined into one deck: three dials, a fader, five keys and a touch strip.",
    },
  },
  {
    id: "apart",
    at: 10,
    until: 22,
    heading: "It comes apart.",
    body: "Every module is a tool of its own. Magnets hold them together. Pogo pins carry the signal.",
    poster: {
      name: "scene-2-apart",
      alt: "The same four modules floating apart, each one a separate aluminum block.",
    },
  },
  {
    id: "turn",
    at: 22,
    until: 34,
    heading: "Turn things.",
    body: "Three machined dials. Volume, brush size, timeline — you decide. Each click feels like it should.",
    poster: {
      name: "scene-3-turn",
      alt: "The dial module in close-up, its three machined aluminum knobs turned to different positions.",
    },
  },
  {
    id: "slide",
    at: 34,
    until: 46,
    heading: "Slide things.",
    body: "A motorized fader that moves on its own. Switch apps and it jumps to the right value. Touch it and it obeys you.",
    poster: {
      name: "scene-4-slide",
      alt: "The fader module in close-up, its cap partway along the milled slot.",
    },
  },
  {
    id: "press",
    at: 46,
    until: 58,
    heading: "Press things.",
    body: "Five keys for the actions you repeat all day. One has a tiny screen, so it always tells you what it does.",
    poster: {
      name: "scene-5-press",
      alt: "The key module in close-up, five aluminum keys in a row with one pressed down.",
    },
  },
  {
    id: "see",
    at: 58,
    until: 70,
    heading: "See things.",
    body: "A touch strip with your levels, your clock, your calls. Glance down instead of alt-tabbing.",
    poster: {
      name: "scene-6-see",
      alt: "The screen module lit up, showing cyan level rings and violet app icons on black glass.",
    },
  },
  {
    id: "voice",
    at: 70,
    until: 84,
    heading: "Take one with you.",
    body: "Voice is the module that left the desk. Push to talk, mute the room, end the call. From the couch.",
    poster: {
      name: "scene-7-voice",
      alt: "MODU Voice, the handheld module: one large dial, a record button and four keys.",
    },
  },
  {
    id: "snap",
    at: 84,
    until: 100,
    heading: "Snap. Done.",
    body: "No screws. No setup screens. Arrange them your way — the deck is ready when it clicks.",
    poster: {
      name: "scene-8-snap",
      alt: "The deck reassembled with its screen awake, the whole rail lit and ready.",
    },
    cta: { label: "Build your deck", href: "#modules" },
  },
] as const;
