// Sends each Download button to the newest release file on GitHub, whatever its version number.
// Route: /dl/<project>/<platform>, e.g. /dl/olympia/windows
// It asks GitHub which file is newest. If GitHub doesn't answer (it rate-limits shared servers),
// it falls back to the last known file name, and then to the releases page.
const PROJECTS = {
  olympia: { repo: 'Cyberhex1/olympia', files: {
    windows: [/setup.*\.exe$/i, 'Olympia-Setup-1.0.0.exe'],
    portable: [/portable.*\.zip$/i, 'Olympia-1.0.0-portable-x64.zip'] } },
  'the-hook-up': { repo: 'Cyberhex1/the-hook-up', files: {
    windows: [/windows\.zip$/i, 'TheHookUp-1.0-Windows.zip'],
    steamdeck: [/steamdeck\.tar\.gz$/i, 'TheHookUp-1.0-SteamDeck.tar.gz'] } },
  streamfix: { repo: 'Cyberhex1/Streamfix', files: {
    windows: [/windows.*\.zip$/i, 'StreamFix-0.2.0-windows-x64.zip'],
    steamdeck: [/steamdeck.*\.tar\.gz$/i, 'StreamFix-0.2.0-steamdeck-linux-x64.tar.gz'] } },
  toktv: { repo: 'Cyberhex1/TokTV', files: { apk: [/\.apk$/i, 'TokTV.apk'] } },
  'zero-browser': { repo: 'Cyberhex1/tv-browser', files: {
    '32bit': [/^[A-Za-z]+-armeabi-v7a\.apk$/i, 'ZeroBrowser-armeabi-v7a.apk'],
    '64bit': [/^[A-Za-z]+-arm64-v8a\.apk$/i, 'ZeroBrowser-arm64-v8a.apk'] } },
  jobsweep: { repo: 'Cyberhex1/jobsweep-app', files: { windows: [/\.exe$/i, 'JobSweep-Setup-0.0.1.exe'] } },
  syspeek: { repo: 'Cyberhex1/SysPeek', files: {
    installer: [/setup\.exe$/i, 'SysPeek-1.1.0-setup.exe'],
    portable: [/win-x64\.zip$/i, 'SysPeek-1.1.0-win-x64.zip'] } },
  localfaves: { repo: 'Cyberhex1/localfaves', files: {
    windows: [/setup.*\.exe$/i, 'LocalFaves-Setup-1.0.0.exe'],
    portable: [/portable.*\.zip$/i, 'LocalFaves-1.0.0-portable-x64.zip'] } },
};

const notYet = (name) => new Response(
  `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">` +
  `<title>Coming soon</title><body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#09080D;color:#F2EFF7;font-family:system-ui,sans-serif">` +
  `<div style="text-align:center;padding:24px"><h1 style="font-weight:600;letter-spacing:-0.03em">${name} isn't released yet</h1>` +
  `<p style="color:#A09BAE">Check back soon.</p><p><a href="/" style="color:#F2EFF7">Back to all projects</a></p></div>`,
  { status: 404, headers: { 'content-type': 'text/html; charset=utf-8' } }
);

export async function onRequestGet({ params }) {
  const key = String(params.project || '').toLowerCase();
  const project = PROJECTS[key];
  const entry = project && project.files[String(params.platform || '').toLowerCase()];
  if (!project || !entry) return new Response('Unknown download', { status: 404 });
  if (!project.repo) return notYet(key === 'syspeek' ? 'SysPeek' : key);

  const [pattern, knownFile] = entry;
  const fallback = knownFile
    ? `https://github.com/${project.repo}/releases/latest/download/${knownFile}`
    : `https://github.com/${project.repo}/releases/latest`;
  try {
    const res = await fetch(`https://api.github.com/repos/${project.repo}/releases/latest`, {
      headers: { 'User-Agent': '0hnna-pages', Accept: 'application/vnd.github+json' },
      cf: { cacheEverything: true, cacheTtlByStatus: { '200-299': 600, '400-599': 0 } },
    });
    if (!res.ok) return Response.redirect(fallback, 302);
    const release = await res.json();
    const asset = (release.assets || []).find((a) => pattern.test(a.name));
    return Response.redirect(asset ? asset.browser_download_url : fallback, 302);
  } catch (err) {
    return Response.redirect(fallback, 302);
  }
}
