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
  },
  {
    id: "apart",
    at: 10,
    until: 22,
    heading: "It comes apart.",
    body: "Every module is a tool of its own. Magnets hold them together. Pogo pins carry the signal.",
  },
  {
    id: "turn",
    at: 22,
    until: 34,
    heading: "Turn things.",
    body: "Three machined dials. Volume, brush size, timeline — you decide. Each click feels like it should.",
  },
  {
    id: "slide",
    at: 34,
    until: 46,
    heading: "Slide things.",
    body: "A motorized fader that moves on its own. Switch apps and it jumps to the right value. Touch it and it obeys you.",
  },
  {
    id: "press",
    at: 46,
    until: 58,
    heading: "Press things.",
    body: "Five keys for the actions you repeat all day. One has a tiny screen, so it always tells you what it does.",
  },
  {
    id: "see",
    at: 58,
    until: 70,
    heading: "See things.",
    body: "A touch strip with your levels, your clock, your calls. Glance down instead of alt-tabbing.",
  },
  {
    id: "voice",
    at: 70,
    until: 84,
    heading: "Take one with you.",
    body: "Voice is the module that left the desk. Push to talk, mute the room, end the call. From the couch.",
  },
  {
    id: "snap",
    at: 84,
    until: 100,
    heading: "Snap. Done.",
    body: "No screws. No setup screens. Arrange them your way — the deck is ready when it clicks.",
    cta: { label: "Build your deck", href: "#modules" },
  },
] as const;
