#Welcome

##About Docbase

Docbase is an open source tool to publish your **markdown** documentation project as a site.

* No server-side components
* Deployable via GitHub Pages
* Can fetch GitHub Readme files
* Gorgeous default theme based on flatdoc; it’s responsive, yes!


##Starting
Once you have the project working, this is how the directory structure would look like:

```bash
  |-images
  |-bower_components
  |-html
  |-node_modules
  |-docbase-config.js
  |-index.html
  |-package.json
  |-styles
  |  |-style.css
  |-search-index.json
  |-docs
  |  |-v1
  |  |  |-howtostart
  |  |  |  |-starting.md
  |-js
  |  |-docbase.js
  |-GruntFile.js
  |-.gitignore
```
The folder docs is where you will put yours documents to be showed like this one here!

```bash
  |-docs
  |  |-v1
  |  |  |-howtostart
  |  |  |  |-starting.md
```
And to each file created you need to add or change the file 'docbase-config.js' to map the files and create the menus!

```javascript
"versions" : {
  "v1": [{
      "name": "howtostart",
      "label": "How to start",
      "files": [{
        "name": "starting",
        "label": "Starting with docbase"
        },{
          "name": "new_file",
          "label": "Label to the new file"
          }]
...
```
To the file
```bash
  |-docs
  |  |-v1
  |  |  |-howtostart
  |  |  |  |-starting.md
  |  |  |  |-new_file.md
```
###So lets do it
