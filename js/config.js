/*
 * ✏️  EDIT THIS FILE to update the website — no other file needs changes
 *     for the common updates (video, live link, music).
 */
window.WEDDING = {
  // Pre-wedding film. Paste any YouTube link (watch / youtu.be / shorts) or just the video ID.
  // Leave "" to show a "Coming soon" card in its place.
  youtube: "",

  // Live stream link (YouTube Live, Instagram Live, etc.). Leave "" until you have it —
  // the site shows "Link will be shared here" until then.
  liveStreamUrl: "",

  // Optional background music (e.g. "assets/music.mp3"). Leave "" for no music.
  musicUrl: "",

  // Your public site address once on GitHub Pages, e.g. "https://username.github.io/my-wedding/".
  // Used in share messages and printed small on the story cards. Leave "" to use the current page URL.
  siteUrl: "",

  // All times are IST (+05:30).
  muhurtham: "2026-12-03T04:46:00+05:30",
  events: {
    wedding: {
      title: "Krishna & Nandini — Wedding (Muhurtham 4:46 AM)",
      start: "2026-12-03T04:46:00+05:30",
      end: "2026-12-03T07:00:00+05:30",
      location: "Hari Hara Sada, Annavaram, Andhra Pradesh 533406",
      map: "https://maps.app.goo.gl/16ggGqFMHx2kWyCL9",
      details: "Muhurtham at 4:46 AM IST. Wedding celebrations & rituals begin on the night of December 2nd.",
      ics: "assets/wedding.ics",
    },
    reception: {
      title: "Krishna & Nandini — Wedding Reception",
      start: "2026-12-06T17:00:00+05:30",
      end: "2026-12-06T22:00:00+05:30",
      location: "Pawar Convention Hall, Viswanathapalle, Velikatta, Siddipet, Telangana 502277",
      map: "https://maps.app.goo.gl/p5RBkiedZHTkyS5b8",
      details: "Reception from 5:00 PM onwards.",
      ics: "assets/reception.ics",
    },
  },

  // When the "LIVE NOW" badge shows (IST).
  liveWindows: [
    { name: "Wedding", from: "2026-12-02T18:00:00+05:30", to: "2026-12-03T08:00:00+05:30" },
    { name: "Reception", from: "2026-12-06T17:00:00+05:30", to: "2026-12-06T23:00:00+05:30" },
  ],
};
