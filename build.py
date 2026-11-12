"""Rebuild ../index.html and ../bridge.js after changing anything in app/ or bridge.js.
Run once: npm install   then: npm run build
The answer key is never part of the site: it is loaded from the console into Firestore."""
import json, os, re, shutil, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
APP = os.path.join(HERE, 'app')
SITE = os.path.join(HERE, '..')
os.makedirs(SITE, exist_ok=True)

js = open(os.path.join(APP, 'app.js'), encoding='utf-8').read()
css = open(os.path.join(APP, 'style.css'), encoding='utf-8').read()
shell = open(os.path.join(APP, 'shell.html'), encoding='utf-8').read()
content = json.load(open(os.path.join(APP, 'content.json'), encoding='utf-8'))

def rep(src, a, b):
    assert src.count(a) == 1, ('expected once', a[:90], src.count(a))
    return src.replace(a, b)

# Start when the Firebase bridge has signed someone in, instead of immediately.
js = rep(js, "\nboot();\n})();", "\nwindow.__mjaStart = function(){ if(window.__mjaStarted) return; window.__mjaStarted = true; boot(); };\n})();")
js = rep(js, "Your account has view-only access to this page, so nothing can be saved. Ask the administrator to share it with you as a Contributor.",
         "Your account is not allowed to save this. Sign out, sign in again and try once more. If it keeps happening, tell the administrator.")
js = rep(js, "Sign in to your organisation\\'s Claude account to take part. If you are signed in and still see this, ask the administrator to share this page with you as a Contributor.",
         "Sign in with your Google account to take part.")
js = rep(js, "This is a preview copy of the page, so answers cannot be saved here. Open the published page to take part.",
         "This copy of the page is not connected to its database, so answers cannot be saved. Open the published site to take part.")
js = rep(js, "'Results are visible only to the owner of this page.'", "'Results are visible only to administrators.'")
js = rep(js, "'Share this page from the Share menu as Contributor. Viewers cannot save answers. Do not make anyone an Editor: editors can change this page.'",
         "(openToAll() ? 'Anyone with a Google account can sign in and take part, including people outside the company.' : 'Anyone with a company Google account can sign in and take part.')+' Only accounts listed as administrators in Firestore can open this console.'")
js = rep(js, "'Add #assessment to the page link for managers, and #feedback for their teams.'",
         "'Send managers the site address with #assessment on the end, their teams the address with #feedback, and their own managers the address with #senior.'")
js = js.replace('__CONTENT__', json.dumps(content, ensure_ascii=False))
assert '"why"' not in js and '"tags"' not in js, 'answer key text found in the page'

shell = rep(shell, '<nav id="nav" aria-label="Sections"></nav>', '<nav id="nav" aria-label="Sections"></nav>\n    <span id="acct" class="acct" hidden></span>')
shell = rep(shell, '<main id="view"', '<div id="gate" class="wrap narrow gate" hidden></div>\n  <main id="view"')
shell = shell.replace('stored where only the owner of this page can read them', 'stored where only administrators can read them')

extra_css = """
[hidden]{display:none!important}
.acct{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--ink-2)}
.acct-name{max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.gate{padding-top:48px}
.gate-card{max-width:560px}
code{font-family:var(--font-num);font-size:.92em;background:var(--surface-2);padding:1px 5px;border-radius:4px}
"""

html = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Manager Judgment Assessment</title>
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Serif:wght@400;500&display=swap">
<style>
{css}
{extra_css}
body{{margin:0}}
</style>
</head>
<body>
{shell}
<script src="config.js"></script>
<script>
{js}
</script>
<script type="module" src="bridge.js"></script>
</body>
</html>
"""
open(os.path.join(SITE, 'index.html'), 'w', encoding='utf-8').write(html)

# Bundle the bridge with Firebase into one file, so the site needs no build step on GitHub.
alias = sys.argv[1] if len(sys.argv) > 1 else None   # 'test' bundles the stand-in Firebase used by the tests
out = os.path.join(SITE, 'bridge.js') if not alias else os.path.join(HERE, 'test', 'bridge.test.js')
cmd = [os.path.join(HERE, 'node_modules', '.bin', 'esbuild'), os.path.join(HERE, 'bridge.js'), '--bundle', '--format=esm',
       '--minify', '--target=es2019', '--legal-comments=eof', '--outfile=' + out]
if alias:
    for m in ('app', 'auth', 'firestore'):
        cmd.append(f'--alias:firebase/{m}=' + os.path.join(HERE, 'test', 'fake-firebase.js'))
subprocess.run(cmd, check=True)
print('built', os.path.join(SITE, 'index.html'), os.path.getsize(os.path.join(SITE, 'index.html')), 'bytes;', out, os.path.getsize(out), 'bytes')
