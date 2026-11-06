/* =====================================================================
   CONTENT FILE: edit everything here. No need to touch app.js / styles.css.
   ---------------------------------------------------------------------
   Tips:
   - Keep text inside "quotes". If you need a quote inside, use “ ” or \".
   - Each { ... } block in `sections` is one page. Reorder,
     delete, or copy-paste blocks freely. Keep the comma between blocks.
   - Photos: put files in the /photos folder, then write "photos/name.jpg".
     If a photo is missing, a soft gradient with a heart shows instead.
   ===================================================================== */

window.BDAY = {
  // ---------- Basics ----------
  momName: "Mommy",
  fullName: "Annalyn",
  age: 48,
  pageTitle: "Happy Birthday, Mommy",

  // ---------- Optional background music ----------
  // Put an .mp3 in a /music folder, e.g. "music/song.mp3". It starts when
  // she taps the envelope. Leave "" to turn music off.
  music: { src: "song.mp3", volume: 0.6 },

  // ---------- Envelope cover ----------
  cover: {
    to: "To: Mommy",
    hint: "Tap the envelope to open",
    cardText: "Happy Birthday!",
  },

  // ---------- Top of the page ----------
  hero: {
    kicker: "For Annalyn, my mom",
    title: "Happy 48th Birthday, Mommy!",
    photo: "photos/Photo.jpg",          // optional. Missing = soft gradient.
    caption: "the birthday girl 🎂",
    subtitle: "Swipe or tap Next to turn the pages.",
  },

  // =================================================================
  // CARDS (top to bottom)
  // Types: panic, chat, volleyball, visa, dish, iou, grad, letter, cake
  // =================================================================
  sections: [
    // ---------- She panics on random things ----------
    {
      type: "panic",
      label: "Fact #1",
      title: "You panic about the most random things.",
      meterLow: "chill",
      meterHigh: "PANIC",
    },

    // ---------- Good morning chats ----------
    // from: "her" (left, Mommy) or "me" (right, you)
    {
      type: "chat",
      label: "Fact #2",
      title: "You say good morning even when I'm still asleep.",
      contact: "Mommy 💛",
      status: "online at 7:00 AM, as usual",
      messages: [
        { from: "her", text: "Good morning anak! ☀️", time: "7:02 AM" },
        { from: "her", text: "Kain ka na breakfast", time: "7:03 AM" },
      ],
      footer: "I don't always reply on time, but it's the first thing I see every day.",
    },

    // ---------- Choco Mucho ----------
    // sets: [Choco Mucho score, opponent score] for each set
    {
      type: "volleyball",
      label: "Fact #3",
      title: "Ride-or-die Choco Mucho fan.",
      team: "Choco Mucho",
      opponent: "Opponent",
      sets: [[25, 21], [25, 23], [22, 25], [19, 25], [12, 15]],
      verdict: "Up 2–0. Then… you know the rest.",
      footer: "Kahit na nagchochoke na sila, die hard fan ka pa din haha. That's loyalty 🏐",
    },

    // ---------- Sinigang + thank you ----------
    // Put a photo of the finished sinigang na baboy at photos/sinigang.jpg
    {
      type: "dish",
      label: "Lesson learned",
      title: "Mommy's Sinigang na Baboy",
      photo: "photos/sinigang.jpg",
      caption: "the best one, no contest 🍲",
      thanks: "Thank you for teaching me paano magluto ng Sinigang.",
    },

    // ---------- VISA teamwork + thank you ----------
    {
      type: "visa",
      label: "Team effort",
      title: "UK & Finland: approved.",
      stamps: [
        { country: "United Kingdom", code: "UK" },
        { country: "Finland", code: "FI" },
      ],
      body: "Di pa tayo nakakaready pero we passed our VISA applications na! Yay ✈️",
      thanks: "Thank you for taking all the stress of handling our VISA applications.",
    },

    // ---------- The gift IOU ----------
    {
      type: "iou",
      label: "About your gift…",
      heading: "IOU",
      text: "Pass muna ako sa physical gift for now hehe. I promise babawi ako next year.",
      valid: "Redeemable: your birthday, 2027",
      stamp: "PROMISE",
      tapHint: "Tap to make it official",
    },

    // ---------- My gift for now: graduating ----------
    {
      type: "grad",
      label: "My gift for now",
      title: "I'm finally graduating this year.",
      diploma: "Diploma",
      classOf: "Class of 2026",
      body: "For now, my gift to you is me finally graduating this year. This one's for you (and Daddy).",
    },

    // ---------- The letter (all English) ----------
    // Use "" for a blank line.
    {
      type: "letter",
      lines: [
        "Dear Mommy,",
        "",
        "Happy 48th birthday!",
        "",
        "Thank you for everything you do for our family. For always looking out for us and for caring for us the way you do.",
        "",
        "People say it's easy to be a housewife, but after seeing all your effort, we know it's one of the most physically and mentally demanding jobs out there.",
        "",
        "We don't say it enough, but we're really grateful to have you as our mom. We wish you good health, and lots of reasons to smile.",
        "",
        "Enjoy your day. We love you so much, Mommy.",
      ],
      signoff: "Love, Neo",
    },

    // ---------- Cake finale ----------
    {
      type: "cake",
      title: "Make a wish, Mommy.",
      hint: "Then tap each candle to blow it out.",
      candles: 5,
      after: "Happy Birthday, Mommy!",
      afterSub: "Love, your eldest son 🎂",
      relight: "Light them again",
    },
  ],

  confetti: ["#D9485F", "#F2B544", "#7A9A5B", "#F7A1B5", "#6C8EBF", "#FFFFFF"],
};
