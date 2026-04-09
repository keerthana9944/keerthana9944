const fs = require("fs");

const USERNAME = "keerthana9944";

async function run() {
  // 1. Fetch profile
  const profileRes = await fetch(`https://api.github.com/users/${USERNAME}`);
  const profile = await profileRes.json();
  
  // 2. Fetch repositories
  const reposRes = await fetch(profile.repos_url);
  const repos = await reposRes.json();

  // 3. Calculate total stars
  const stars = repos.reduce(
    (total, repo) => total + repo.stargazers_count,0);
  
   // 4️. Calculate top languages
  const languageTotals = {};

  for (const repo of repos) {
    if (!repo.languages_url) continue;

    const langRes = await fetch(repo.languages_url);
    const languages = await langRes.json();

    for (const [language, bytes] of Object.entries(languages)) {
      languageTotals[language] =
        (languageTotals[language] || 0) + bytes;
    }
  }

  // 5️. Sort languages by usage
  const topLanguages = Object.entries(languageTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5) // top 5
    .map(([lang]) => `- ${lang}`)
    .join("\n");

  // 6. Read README
  let readme = fs.readFileSync("README.md", "utf8");
  
  // 7. Replace Placeholders
  readme = readme
    .replace("{{USERNAME}}", USERNAME)
    .replace("{{REPOS}}", profile.public_repos)
    .replace("{{FOLLOWERS}}", profile.followers)
    .replace("{{STARS}}", stars)
    .replace("{{UPDATED}}", new Date().toUTCString())
    .replace("{{TOP_LANGUAGES}}", topLanguages || "No data yet");

  // 8. write README back
  fs.writeFileSync("README.md", readme);
}

run();
