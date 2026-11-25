# ITIL® Foundation (Version 5) Mock Quiz

A free, browser-based mock exam for the **ITIL® Foundation (Version 5)** exam. It has 17 timed sections of 40 multiple-choice questions each (680 questions in total). Each section runs as an exam simulation laid out like the live online exam, followed by a full answer review with explanations. It works on desktop and mobile.

> [!IMPORTANT]
> **For practice only.** Every question in this quiz is an original sample question written for revision. None are taken from, or represent, the official ITIL® Foundation (Version 5) exam, and a good score here does not guarantee a pass on the real exam.

## Features

- **17 sections × 40 questions**, grouped by syllabus topic.
- **Exam simulation, modelled on the live online exam:**
  - an exam information screen before you start
  - a 60-minute countdown for 40 questions, shown in the top right
  - a question menu on the left, with the current question highlighted and a flag icon next to each number (amber when flagged)
  - Previous / Next buttons, a "Flag for review" button and text-size controls
  - a reminder when 15 minutes are left, and automatic submission when time runs out
  - **End Exam** (bottom right), with a warning about unanswered and flagged questions
- **Show correct answer after each question** (on by default): once you answer, the question locks, the correct answer is highlighted, and an explanation of why appears straight away. A running "correct so far" count appears at the bottom. Turn it off on the home page or the exam information screen for a strict simulation where answers are only revealed at the end, like the real exam.
- **Results:** a provisional result sheet (pass/fail, score, pass mark of 26/40, questions answered, time used) that you can print, followed by a full review of every question with the correct answer and an explanation.
- **Retake any section** as often as you like, or retake only the questions you got wrong.
- **Full mock exam:** 40 random questions from all sections.
- **Study:** read all 40 questions and answers in a section before you sit the exam.
- **Shuffled questions and answers** on every attempt (shuffling questions can be turned off).
- **Mobile friendly:** on phones the question menu becomes a scrollable strip of numbers, and the buttons are sized for touch.
- **Light and dark mode**, with soft colours that are easy on the eyes.
- **Keyboard shortcuts:** 1–4 or A–D to answer, ← / → to move between questions, F to flag, Enter to go to the next question after seeing the answer.
- Scores and theme are saved in your own browser only. There is no account, server or tracking.

## Getting started

No installation or build step is needed.

1. Download or clone this repository.
2. Open `index.html` in any modern browser (Edge, Chrome, Firefox or Safari).

```powershell
git clone <this-repository-url>
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

Every one of the 95 assessment criteria in the ITIL Foundation (Version 5) syllabus is covered by at least three questions.

## Project structure

```
index.html          The app: layout, styles, quiz engine, timer, scoring
questions/
  s01.js … s17.js   One question bank file per section
```

Each question file registers a section with `QB.add(number, title, syllabusRefs, items)`. Each item has this shape:

```js
["Question text",
 "Correct answer",
 ["Wrong answer 1", "Wrong answer 2", "Wrong answer 3"],
 "Explanation of why the answer is correct",
 "Source / syllabus reference"]
```

The app shuffles the answer order at runtime, so the correct answer is always written second in the file.

To **add a section**, create `questions/s18.js` using the same format and add a matching `<script src="questions/s18.js"></script>` line in `index.html`.

## Disclaimer

- **For practice only.** Every question is an original sample question written for revision. None are taken from, or represent, the official ITIL® Foundation (Version 5) exam. Some are reworded versions of the official sample-paper practice questions, which are themselves not live exam questions.
- Questions and explanations are based on publicly described ITIL Foundation (Version 5) concepts. They may contain mistakes. Always check against the official ITIL publications.
- This project is not affiliated with, endorsed by or sponsored by PeopleCert or AXELOS.
- ITIL® and PRINCE2® are registered trademarks of PeopleCert. DevOps Institute® is a registered trademark of its respective owner. All other trademarks belong to their respective owners.
