# ITIL® Foundation (Version 5) Mock Quiz

A free, browser-based practice quiz for the **ITIL® Foundation (Version 5)** exam. It has 17 timed sections of 40 multiple-choice questions each (680 questions in total), and explains every answer.

> [!IMPORTANT]
> **For practice only.** Every question in this quiz is an original sample question written for revision. None are taken from, or represent, the official ITIL® Foundation (Version 5) exam, and a good score here does not guarantee a pass on the real exam.

## Features

- **17 sections × 40 questions**, grouped by syllabus topic.
- **One-minute timer per question.** If time runs out, the question counts as unanswered.
- **Instant feedback:** after every answer you see whether you were right, the correct answer, and a short explanation of why.
- **Results screen:** your score out of 40, pass/fail against the 65% pass mark (26 of 40, as in the real exam), and a full review of every question.
- **Retake any section** as often as you like, or practise only the questions you got wrong.
- **Mock exam mode:** 40 random questions drawn from all sections.
- **Study answers mode:** read all 40 questions and answers in a section before testing yourself.
- **Shuffled questions and answers** on every attempt (shuffling questions can be turned off).
- **Light and dark mode**, with soft colours that are easy on the eyes.
- **Keyboard shortcuts:** press 1–4 or A–D to answer, and Enter to continue.
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
