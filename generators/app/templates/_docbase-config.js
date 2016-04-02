var docbaseConfig = {
  "method": "<%= hostType %>",
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
  "default_version": "<%= defaultVersion %>",
  "manual_override": <%= manual_override %>,
  "versions" : <%= getVersions %>,
  "publish": "<%= publishType %>"
}
