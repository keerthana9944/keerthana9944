import fs from "fs";

const USERNAME = "Naveenpanaganti";

const now = new Date().toUTCString();

let readme = fs.readFileSync("README.md", "utf8");

readme = readme
  .replace("loading...", "Auto update working ✅")
  .replace("never", now);

fs.writeFileSync("README.md", readme);
