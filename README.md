# Manager Judgment Assessment

A situational judgment test for people managers, a confidential survey for their teams, feedback from their own managers, and an administrator console that turns the results into training priorities.

- **Managers** answer 27 workplace situations. For each one they pick the most and the least effective of four responses. They never see a score.
- **Team members** answer 18 questions about what their manager does day to day. Results are shown only as averages, once at least five people have answered about the same manager.
- **Their own managers** answer 18 questions about what they see a manager who reports to them do, with two optional comments. Administrators see these answers with the rater's name; the manager's development summary names only the areas rated highest and lowest.
- **Administrators** see scores, personas, error patterns, red flags and the reasoning behind each, team survey averages, training needs across the group, question statistics, and a development summary to send each manager.

The site is a static page on GitHub Pages. Sign-in, answers and the answer key live in Firebase. The answer key is **not** in this repository: an administrator loads it into the database from the console, where only administrators can read it.

**To set it up, follow [SETUP.md](SETUP.md).**

## Status

Draft form A, version 0.2. The scenarios and answer key are theory-based and not yet validated. Managers are described by five personas, from the highest score down: The Mentor, The Anchor, The Builder, The Apprentice and The Explorer. The cut-offs between them (+27 where The Anchor starts, +14 where The Builder starts) are placeholders. Confirm the key and set the cut-offs with an expert panel and a pilot before relying on personas. Use the results for development only, never for pay, promotion or exit decisions.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The page: test, survey and console (built from `source/`) |
| `bridge.js` | Firebase sign-in and storage for the page (built from `source/bridge.js`) |
| `config.js` | Your Firebase project settings and allowed email domain. Edit this one |
| `firestore.rules` | Who can read and write what. Paste into Firebase |
| `source/` | The files the page is built from, and the build script |
