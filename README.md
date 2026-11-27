# ITIL® Foundation (Version 5) Mock Quiz

A free, browser-based mock exam for the **ITIL® Foundation (Version 5)** exam. It has 23 timed sections with 846 multiple-choice questions in total: 17 sections of 40, plus six deep-dive sections written from the syllabus-relevant chapters of the Official Book (version 5.1). Each section runs as an exam simulation laid out like the live online exam, followed by a full answer review with explanations. It works on desktop and mobile.

> [!IMPORTANT]
> **For practice only.** Every question in this quiz is an original sample question written for revision. None are taken from, or represent, the official ITIL® Foundation (Version 5) exam, and a good score here does not guarantee a pass on the real exam.

## Features

- **23 sections, 846 questions**, grouped by syllabus topic (sections 1–17 have 40 questions each; the six Official Book deep-dives have 24–34).
- **Exam simulation, modelled on the live online exam:**
  - an exam information screen before you start
  - a countdown of 90 seconds per question (60 minutes for 40 questions), shown in the top right
  - a question menu on the left, with the current question highlighted and a flag icon next to each number (amber when flagged)
  - Previous / Next buttons, a "Flag for review" button and text-size controls
  - a reminder when 15 minutes are left, and automatic submission when time runs out
  - **End Exam** (bottom right) opens a **review screen** first: a tile for every question showing answered, unanswered and flagged, with filters, so you can jump back before you submit
  - **Resume after closing:** if you close or refresh the page mid-exam, your answers, flags and remaining time are saved with the timer paused. Resume or discard it from the home page. "Exit" also offers *Save and exit*.
- **Show correct answer after each question** (on by default): once you answer, the question locks, the correct answer is highlighted, and an explanation of why appears straight away. A running "correct so far" count appears at the bottom. Turn it off on the home page or the exam information screen for a strict simulation where answers are only revealed at the end, like the real exam.
- **Results:** a provisional result sheet (pass/fail, score, pass mark of 65% (26/40 for a 40-question section), questions answered, time used) that you can print, followed by a full review of every question with the correct answer and an explanation.
- **Retake any section** as often as you like, or retake only the questions you got wrong.
- **Full mock exam:** 40 random questions from all sections.
- **Weak-topic tracker:** every answer is tracked against the 21 syllabus topics (1.1 to 7.2). The home page shows your five weakest topics, and the *All topics* page shows your accuracy for every topic against the 65% pass line. Each topic has a **Practise** button for a timed exam of up to 40 questions on that topic.
- **Review queue:** questions you get wrong or flag are added to a review queue. **Start review exam** builds an exam from them, and a question leaves the queue once you answer it correctly twice in a row.
- **Score history:** a chart of your recent scores against the 65% pass line (hover over a point for details), plus a full table of every attempt.
- **Flashcards:** 69 cards for the key terms and definitions, filterable by syllabus category. Tap to flip, then mark *Knew it* or *Didn't know*. Missed cards come back later in the round. Keyboard: Space to flip, K / D to mark.
- **Search:** search all 846 questions, answers and explanations for any term, with matches highlighted.
- **Study:** read all the questions and answers in a section before you sit the exam.
- **Installable and works offline:** when served over the web (for example on GitHub Pages), you can install it to your phone's home screen or your desktop, and it keeps working without an internet connection.
- **Shuffled questions and answers** on every attempt (shuffling questions can be turned off).
- **Mobile friendly:** on phones the question menu becomes a scrollable strip of numbers, and the buttons are sized for touch.
- **Light and dark mode**, with soft colours that are easy on the eyes.
- **Keyboard shortcuts:** 1–4 or A–D to answer, ← / → to move between questions, F to flag, Enter to go to the next question after seeing the answer.
- Scores, topic statistics, review queue, history, flashcard progress and theme are saved in your own browser only. There is no account, server or tracking. *Reset all progress* at the bottom of the home page clears them.

## Getting started

No installation or build step is needed.

1. Download or clone this repository.
2. Open `index.html` in any modern browser (Edge, Chrome, Firefox or Safari).

```powershell
git clone <this-repository-url>
```

Opening `index.html` directly from disk works for everything except installing the app and offline mode. Those need the files served over http(s).

### Install it on your phone or desktop

1. Publish the repository with GitHub Pages: on GitHub, go to **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/ (root)`, and save.
2. Open the Pages address on your phone or computer.
3. Install it:
   - **Android (Chrome):** menu ⋮ → *Install app* (or *Add to Home screen*).
   - **iPhone/iPad (Safari):** Share → *Add to Home Screen*.
   - **Desktop (Chrome/Edge):** the install icon in the address bar.

After the first visit the app works offline. When you are online it always loads the latest version.

To test locally over http, run this in the project folder and open http://localhost:8000:

```powershell
python -m http.server 8000
```

The headings use Google Fonts when you are online; offline, the app falls back to system fonts and still works.

## Sections

| # | Section | Syllabus area |
|---|---|---|
| 1 | Products, services and digital product & service management | 1.1 |
| 2 | Service offerings and value co-creation | 1.2 – 1.3 |
| 3 | Service relationships, roles, quality and SLAs | 1.4, 1.1.7 |
| 4 | The ITIL Four Dimensions and external factors | 2.1 – 2.2 |
| 5 | The ITIL Product and Service Lifecycle | 3.1 – 3.2 |
| 6 | ITIL Value System and Guiding Principles (part 1) | 4.1, 4.2.1 – 4.2.4 |
| 7 | Guiding Principles (part 2) and Governance | 4.2.5 – 4.2.9, 4.3 |
| 8 | Value chain key terms | 4.4.1 – 4.4.10 |
| 9 | Success metrics, operating model and management practices | 4.4.11 – 4.4.12, 4.5 |
| 10 | Continual improvement and the Continual Improvement Model | 4.6 |
| 11 | Value streams, mapping, management and complexity | 5.1 – 5.3 |
| 12 | ITIL and AI, DevOps and PRINCE2 | 6, 7 |
| 13 | Scenario practice: value, services and relationships | 1 |
| 14 | Scenario practice: dimensions, lifecycle and value chain | 2, 3, 4.4 |
| 15 | Scenario practice: principles, governance, practices and improvement | 4 |
| 16 | Exam traps, value streams, AI and other frameworks | 5, 6, 7 |
| 17 | Syllabus gap-filler | all |
| 18 | Official Book deep-dive: service relationships (service provider role, relationship types, journey, experience, SLAs) | 1.4 (incl. 1.4.7, now an "understand" criterion in syllabus v5.1) |
| 19 | Official Book deep-dive: applying the guiding principles | 4.2 (each principle "including subsections", as in syllabus v5.1) |
| 20 | Official Book deep-dive: governance patterns, value chain patterns and practices | 4.3 – 4.5 |
| 21 | Official Book deep-dive: continual improvement, value streams, the Four Dimensions, AI and other frameworks | 2.1, 4.6, 5, 6, 7 (incl. 6.1.3, reworded in syllabus v5.1) |
| 22 | Official Book deep-dive: the eight lifecycle activities in practice | 3.1 – 3.2 |
| 23 | Official Book deep-dive: key concepts, the service economy, complexity and the Value System | 1, 4.1, 5.1 – 5.2 |

Every one of the 95 assessment criteria in the ITIL Foundation (Version 5) syllabus is covered by at least three questions.

## Project structure

```
index.html             Page layout and styles (light and dark themes)
app.js                 The app: exam engine, timer, review screen, resume, results, tracker,
                       review queue, score history, flashcards, search
questions/
  s01.js … s23.js      One question bank file per section
  flashcards.js        The flashcard deck: [term, definition, syllabus category]
manifest.webmanifest   App name, colours and icons for installing
sw.js                  Service worker for offline use
icons/                 App icons
```

Each question is mapped to a syllabus topic from its source reference (for example "Syllabus 4.2.3" → topic 4.2), which drives the topic tracker and topic exams.

Each question file registers a section with `QB.add(number, title, syllabusRefs, items)`. Each item has this shape:

```js
["Question text",
 "Correct answer",
 ["Wrong answer 1", "Wrong answer 2", "Wrong answer 3"],
 "Explanation of why the answer is correct",
 "Source / syllabus reference"]
```

The app shuffles the answer order at runtime, so the correct answer is always written second in the file.

To **add a section**, create `questions/s18.js` using the same format, add a matching `<script src="questions/s18.js"></script>` line in `index.html`, and add the file to the `FILES` list in `sw.js` (bumping `VERSION`) so it is available offline.

## Disclaimer

- **For practice only.** Every question is an original sample question written for revision. None are taken from, or represent, the official ITIL® Foundation (Version 5) exam. Some are reworded versions of the official sample-paper practice questions, which are themselves not live exam questions.
- Questions and explanations are based on publicly described ITIL Foundation (Version 5) concepts. They may contain mistakes. Always check against the official ITIL publications.
- This project is not affiliated with, endorsed by or sponsored by PeopleCert or AXELOS.
- ITIL® and PRINCE2® are registered trademarks of PeopleCert. DevOps Institute® is a registered trademark of its respective owner. All other trademarks belong to their respective owners.
