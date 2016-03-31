var docbaseConfig = {
  "method": "<%= hostType %>",
  "map": {
    "file": "map.json",
    "path": ""
  },
  "generic": {
    "baseurl": "<%= baseUrl %>",
    "path": "<%= basePath %>"
  },
  "file": {
    "path": "<%= basePath %>"
  },
  "github": {
    "user": "<%= githubUser %>",
    "repo": "<%= githubRepo %>",
    "path": "<%= githubPath %>",
    "branch": "<%= githubBranch %>",
    "access_token": "<%= githubAccess_token %>"
  },
  "indexHtml": "./html/main.html",
  "flatdocHtml": "./bower_components/docbase/html/flatdoc.html",
  "html5mode": false,
  "default_version": null,
  "versions" : <%= getVersions %>
}
