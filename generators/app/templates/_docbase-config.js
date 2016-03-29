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
  "versions" : {
    "v1": [{
      "name": "sample",
      "label": "Sample Label",
      "files": [{
        "name": "sample1",
        "label": "Sample 1 Doc"
      },]
    }, {
      "name": "howtostart",
      "label": "How to start",
      "files": [{
        "name": "starting",
        "label": "Starting with docbase"
      }]
    }],
    "v2": [{
      "name": "sample",
      "label": "Sample Label",
      "files": [{
        "name": "sample1",
        "label": "Sample 2 Doc"
      }]
    }]
  }
}
