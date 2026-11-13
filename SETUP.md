# Setup guide

About 20 minutes, once. You need a GitHub account and your company Google account. No coding.

When you finish, the site lives at **https://ACCOUNT.github.io/REPOSITORY/**. Replace ACCOUNT with the GitHub account or organisation that owns the repository, and REPOSITORY with its name, wherever they appear in this guide. For example, a repository at `github.com/trainers-media-lab/AssessmentLab` is published at `https://trainers-media-lab.github.io/AssessmentLab/`.

It has four addresses:
- `…/REPOSITORY/#assessment` for managers
- `…/REPOSITORY/#feedback` for their team members
- `…/REPOSITORY/#senior` for the people those managers report to
- `…/REPOSITORY/#console` for you (administrators only)

## How it works

- **GitHub Pages** serves the page. It is a static file and holds no answers and no answer key.
- **Firebase Authentication** handles sign-in. Any Google account with a verified email can sign in and take part. Only administrators, who must have a company account, can open the console (set in `config.js` and `firestore.rules`).
- **Cloud Firestore** stores the answers, the team and senior feedback, and the answer key.
- **`firestore.rules`** decides who can read what. Firebase enforces it whatever the page does:

| Data | Who can read it | Who can change it |
| --- | --- | --- |
| Answer key, settings, locked copies | Administrators | Administrators |
| A manager's answers | That manager and administrators | That manager, until they submit; administrators |
| A manager's persona, once you share it | That manager and administrators | Administrators |
| A person's team feedback | That person and administrators | That person; administrators |
| Feedback a person gives on a manager who reports to them | That person and administrators | That person; administrators |
| List of managers taking part (names only) | Anyone signed in | Each manager adds themselves |
| Display names | Anyone signed in | Each person, their own |

Administrators are the people you list by hand in Firestore (step 7). The site cannot add one.

## Step 1. Turn on GitHub Pages

1. In this repository, open **Settings** → **Pages**.
2. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
3. Set **Branch** to **main** and the folder to **/ (root)**, then click **Save**.
4. Wait a minute, then open the site address above. It should say **"Not connected yet"**. That is expected.

On a free GitHub plan the repository must be public for Pages to work. That is safe: nothing secret is in it. Never add the answer key file to this repository.

## Step 2. Create a Firebase project

1. Go to https://console.firebase.google.com and sign in with your company Google account.
2. Click **Create a project** (or **Add project**), name it, for example, `manager-assessment`, and continue.
3. Turn Google Analytics off. It isn't needed. Click **Create project**.

The free **Spark** plan is enough: it allows tens of thousands of reads and writes a day, and a full assessment round uses a few thousand.

## Step 3. Connect the site to the project

1. In Firebase, click the gear icon → **Project settings** → **General**.
2. Under **Your apps**, click the web icon **`</>`**, give it a nickname, leave "Firebase Hosting" unticked, and click **Register app**.
3. Firebase shows a `firebaseConfig` block with `apiKey`, `authDomain`, `projectId` and so on.
4. In GitHub, open **`config.js`**, click the pencil icon, and copy each value into the matching line between the quotes. Click **Commit changes**.

These values only identify your project. They are meant to be public. The rules in step 5 protect the data.

If your company email domain is not `databeat.io`, change `allowedDomain` in `config.js` too.

## Step 4. Turn on Google sign-in

1. In Firebase, go to **Build** → **Authentication** → **Get started**.
2. On **Sign-in method**, choose **Google**, switch it on, pick a support email, and click **Save**.
3. On the **Settings** tab, open **Authorized domains**, click **Add domain**, and add `ACCOUNT.github.io`.

## Step 5. Create the database and publish the rules

1. Go to **Build** → **Firestore Database** → **Create database**.
2. Pick a location close to your people (for India, `asia-south1 (Mumbai)`). You cannot change it later.
3. Choose **Start in production mode** and click **Create**.
4. Open the **Rules** tab and delete everything in the editor.
5. Paste in the whole of `firestore.rules` from this repository and click **Publish**. Firebase checks the rules when you publish. If it reports an error, stop and ask for help.
6. If your company email domain is not `databeat.io`, edit the line `.matches('.*@databeat[.]io$')` before you publish.

Quick check in the **Rules Playground** (button on the Rules tab):
- Simulation type **get**, location `/admin/key`, **Authenticated** off → **Run**. It must say **Denied**.
- Simulation type **get**, location `/responses/anyone` → **Run**. It must say **Denied**.

## Step 6. Sign in once

Open the site, click **Sign in with Google**, and sign in with your company account. This registers you. You'll see the start page.

## Step 7. Make yourself an administrator

1. In Firebase, go to **Firestore Database** → **Data** → **Start collection**.
2. Enter the collection ID `admins` and click **Next**.
3. For the **Document ID**, type your company email address in **lower case**, exactly as you sign in with it.
4. Add one field: name `role`, type string, value `admin`. Click **Save**.

To add another administrator later, add another document to `admins` with their email as the ID.

## Step 8. Load the answer key

1. Open `…/REPOSITORY/#console` and reload the page.
2. The console says the answer key is not loaded. Click **Answer key file** and choose the key file you were sent (`answer-key-A-0.2.json`).
3. The console then shows clearly labelled sample data until real people submit.

Keep the key file private. Don't email it around, don't add it to this repository, and delete stray copies once it's loaded.

## Step 9. Dry run, then send the links

1. Ask one manager and one team member to try it:
   - Manager: `https://ACCOUNT.github.io/REPOSITORY/#assessment`
   - Team member: `https://ACCOUNT.github.io/REPOSITORY/#feedback`
   - The manager's own manager: `https://ACCOUNT.github.io/REPOSITORY/#senior`
2. In the console, check the manager appears with a persona, then delete the trial data: **Settings** → **End of cycle**.
3. Send the links to everyone. Anyone with a Google account can sign in; nobody needs to be added first.

While responses come in, press **Lock new submissions** on the Overview tab now and then. It keeps an administrator-only copy of every submitted answer sheet. Press **Share personas** there when you want managers to see their persona on their assessment page.

## Troubleshooting

| What you see | Why, and the fix |
| --- | --- |
| "Not connected yet" | `config.js` still has empty values (step 3). After committing, wait a minute and reload. |
| Sign-in window closes straight away, or "not yet authorised" | Add `ACCOUNT.github.io` under Authentication → Settings → Authorized domains (step 4). Allow pop-ups for the site. |
| "That account cannot take part" | Google hasn't verified the account's email address. If `openTest` is `false` in `config.js`, the account must also be on the company domain. |
| "Administrator only" when you open the console | The document ID in `admins` doesn't exactly match your email in lower case (step 7). Reload after fixing. |
| "Your account is not allowed to save this" | The rules weren't published, or an older copy is published. Publish the current `firestore.rules` (step 5). |
| A manager can't change answers after submitting | Intended. Delete their data in the console (Managers → select them → Delete) if they need to retake. |

## Changing the questions or the page

The page is built from the files in `source/`. After editing `source/app/content.json` or anything else there, rebuild `index.html` and `bridge.js`:

```
cd source
npm install
npm run build
```

Then commit both files. If you change the questions, also make a new answer key and load it from **Console** → **Settings**. Before changing questions mid-cycle, read the note in the console about earlier-version responses.
