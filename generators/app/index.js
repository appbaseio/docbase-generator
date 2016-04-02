'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var options = {};
var p = require('process');
var f = require('fs');
module.exports = yeoman.generators.Base.extend({
  prompting: function() {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log("Welcome to " +
      "\n    .___           ___.                         " +
      "\n  __| _/____   ____\\_ |__ _____    ______ ____  " +
      "\n / __ |/  _ \\_/ ___\\| __ \\\\__  \\  /  ___// __ \\ " +
      "\n/ /_/ (  <_> )  \\___| \\_\\ \\/ __ \\_\\___ \\\\  ___/ " +
      "\n\\____ |\\____/ \\___  >___  (____  /____  >\\___  >" +
      "\n     \\/           \\/    \\/     \\/     \\/     \\/ " +
      "\n        generator!\n");
    //1. source Question
    var sourceQuestion = [{
      type: 'input',
      name: 'start',
      message: 'Press enter to begin'
    }, {
      type: 'list',
      name: "hostType",
      default: 'magic',
      required: true,
      message: '1. Where is your .md project hosted?',
      choices: [{
        name: 'Magic        *(۞ ͜۞)* ',
        value: 'magic'
      }, {
        name: 'Filesystem',
        value: 'file'
      }, {
        name: 'Github',
        value: 'github'
      }, {
        name: 'External URL',
        value: 'generic'
      }]
    }];

    var sourceSubQuestion = {
      generic: [{
        type: 'input',
        name: 'baseUrl',
        message: '  a. Enter the base URL'
      }, {
        type: 'input',
        name: 'basePath',
        message: '  b. Enter the relative path from the base URL'
      }],
      file: [{
        type: 'input',
        name: 'basePath',
        message: '  a. Enter the relative path for .md files from present directory',
        default: 'boilerplate_docs',
        required: false
      }],
      github: [{
        type: 'input',
        name: 'githubUser',
        message: '  a. Enter your github user or organization name'
      }, {
        type: 'input',
        name: 'githubRepo',
        message: '  b. Enter your github repository name'
      }, {
        type: 'input',
        name: 'githubBranch',
        message: '  c. Enter the branch name for this repository',
        default: 'master'
      }, {
        type: 'input',
        name: 'githubPath',
        message: '  d. Enter the relative path for .md files within the branch'
      }, {
        type: 'input',
        name: 'githubAccess_token',
        message: '  e. [Optional] Provide a github token with public access permissions'
      }],
      magic: []
    }

    // 2. Publish Questions
    var publishQuestions = [{
      type: 'list',
      name: "publishType",
      default: 'local',
      required: false,
      message: "2. Where would you like to publish?",
      choices: [{
        name: 'Locally',
        value: 'local'
      }, {
        name: 'Github pages (with travis-ci)',
        value: 'github'
      }]
    }];

    var publishSubQuestions = {
      github: [{
        type: 'input',
        name: 'publishUsername',
        required: true,
        message: '  a. Enter the github username under which you want to publish'
      }, {
        type: 'input',
        name: 'publishRepo',
        required: true,
        message: '  b. Enter the github repository name under which you want to publish'
      }, {
        type: 'input',
        name: 'githubAccess_token',
        required: true,
        message: '  c. Provide a github token with public access permissions'
      }],
      local: []
    };

    // 3. Ask for theme
    var themePrompts = [{
      type: 'input',
      name: 'primaryColor',
      message: '3. Choose your primary theme color (say green, #abcdef)',
      default: 'firebrick',
      required: false
    }];

    var self = this;
    self.prompt(sourceQuestion, function(propsSource) {
      if (propsSource.hostType === 'magic') {
        self.log(chalk.dim('Docbase generated a template directory ') + chalk.green.bold('boilerplate_docs/')+ chalk.dim(' with .md files, just for you.'));
      }
      self.prompt(sourceSubQuestion[propsSource.hostType || 'file'], function(propsHostType) {
        self.prompt(publishQuestions, function(propsPublish) {
          if (propsPublish.publishType == 'github' && propsSource.hostType != 'github') {
            self.prompt(publishSubQuestions[propsPublish.publishType || 'local'], function(propsSubPublish) {

              self.propsInSource = _.assign(propsHostType, propsSource);
              self.propsInPublish = _.assign(propsSubPublish, propsPublish);
              self.props = _.merge(self.propsInSource, self.propsInPublish);
              typeQuestionApply(self);
            });
          } else {

            self.props = _.assign(propsHostType, propsSource);
            self.props['publishType'] = propsPublish.publishType;
            self.props['publishUsername'] = self.props['githubUser'];
            self.props['publishRepo'] = self.props['githubRepo'];
            typeQuestionApply(self);
          }
        });

      });
    });

    function typeQuestionApply(self) {
      self.prompt(themePrompts, function(propsTheme) {
        self.props['primaryColor'] = propsTheme.primaryColor;
        done();
      });
    }
  },

  writing: {
    app: function() {
      var files = [{
        'template': '_bower.json',
        'name': 'bower.json'
      }, {
        'template': '_.gitignore',
        "name": '.gitignore',
      }, {
        'template': '_package.json',
        'name': 'package.json'
      }, {
        'template': '_GruntFile.js',
        'name': 'GruntFile.js'
      }, {
        'template': '_index.html',
        'name': 'index.html'
      }, {
        'template': '_docbase-config.js',
        'name': 'docbase-config.js'
      }, {
        'template': 'html/_main.html',
        'name': 'html/main.html'
      }, {
        'template': 'html/_navbar.html',
        'name': 'html/navbar.html'
      }, {
        'template': 'boilerplate_docs/v1/getting-started/_configure.md',
        'name': 'boilerplate_docs/v1/getting-started/configure.md'
      }, {
        'template': 'boilerplate_docs/v1/getting-started/_start.md',
        'name': 'boilerplate_docs/v1/getting-started/start.md'
      }, {
        'template': 'boilerplate_docs/v1/features/_colors.md',
        'name': 'boilerplate_docs/v1/features/colors.md'
      }, {
        'template': 'boilerplate_docs/v1/features/_gh-pages.md',
        'name': 'boilerplate_docs/v1/features/gh-pages.md'
      }, {
        'template': 'boilerplate_docs/v1/features/_search.md',
        'name': 'boilerplate_docs/v1/features/search.md'
      }, {
        'template': 'boilerplate_docs/v1/features/_versions.md',
        'name': 'boilerplate_docs/v1/features/versions.md'
      }, {
        'template': 'boilerplate_docs/v1/layout/_3col.md',
        'name': 'boilerplate_docs/v1/layout/3col.md'
      }, {
        'template': 'boilerplate_docs/v1/layout/_navigation.md',
        'name': 'boilerplate_docs/v1/layout/navigation.md'
      }, {
        'template': 'boilerplate_docs/v2/changelog/_changelog.md',
        'name': 'boilerplate_docs/v2/changelog/changelog.md'
      }, {
        'template': '_search-index.json',
        'name': 'search-index.json'
      }, {
        'template': 'styles/_style.css',
        'name': 'styles/style.css'
      }, {
        'template': 'styles/_theme.css',
        'name': 'styles/theme.css'
      }, {
        'template': 'images/_logo.png',
        'name': 'images/logo.png'
      }, {
        'template': '_getGitMap.html',
        'name': 'getGitMap.html'
      }, {
        'template': '_.travis.yml',
        'name': '.travis.yml'
      }];
      var defaultOptions = {
        baseUrl: "",
        basePath: "",
        githubUser: "",
        githubPath: "",
        githubRepo: "",
        githubBranch: "",
        githubAccess_token: "",
        primaryColor: "",
        publishUsername: "",
        publishRepo: "",
        publishType: "local",
        gruntTarget: ""
      };
      if (this.props.hostType === 'magic') {
        this.props.hostType = 'file';
        this.props.basePath = 'boilerplate_docs';
      }
      options = _.assign(defaultOptions, this.props);
      options.generateSearchIndex = true;
      options.generateHtml = true;
      options.githubAccess_token = new Buffer(options.githubAccess_token).toString('base64');
      options.baseFolder = 'build_html';
      var publishRepoLink = "'https://' + new Buffer(process.env.DOCBASE_TOKEN, 'base64').toString() + '@github.com/" + options.publishUsername + "/" + options.publishRepo + ".git'";
      options.publishRepoLink = options.publishType == 'github' ? publishRepoLink : "''";
      options.gruntOperation = options.publishType == 'github' ? 'parallel' : 'series';
      options.gruntTarget = 'def';

      var self = this;
      function getVersions() {
        var sampleVersions = {
          "v1": [
            {
              "name": "getting-started",
              "label": "Getting Started",
              "files": [
                {
                  "name": "start",
                  "label": "Quick Start"
                },
                {
                  "name": "configure",
                  "label": "Configuration Options"
                }
              ]
            },
            {
              "name": "features",
              "label": "Features",
              "files": [
                {
                  "name": "search",
                  "label": "Search"
                },
                {
                  "name": "colors",
                  "label": "Colorful"
                },
                {
                  "name": "gh-pages",
                  "label": "Deploy to Github"
                },
                {
                  "name": "versions",
                  "label": "Versatile Navigation"
                }
              ]
            },
            {
              "name": "layout",
              "label": "Layout",
              "files": [
                {
                  "name": "navigation",
                  "label": "Site Navigation"
                },
                {
                  "name": "3col",
                  "label": "Three columns"
                }
              ]
            }
          ],
          "v2": [
            {
              "name": "changelog",
              "label": "Changes",
              "files": [{
                "name": "changelog",
                "label": "Changelog"
              }]
            }
          ]
        };
        var default_version = "";
        var target_file = 'docbase-config.js';
        if(self.fs.exists(target_file)) {
          var configData = null;
          var configConten = self.fs.read(target_file);
          var configContent = eval(configConten + " configData = docbaseConfig;");
          console.log(configData);
          if(configData.hasOwnProperty('versions')) {
            sampleVersions = configData.versions;
          }
          if(configData.hasOwnProperty('default_version')) {
            default_version = configData.default_version;
          }
        }
        return {
          "sampleVersions": sampleVersions,
          "default_version": default_version
        };
      }

      options.getVersions = JSON.stringify(getVersions().sampleVersions, null, 2);
      options.defaultVersion = getVersions().default_version;

      var templateData = options;
      files.forEach(function(file) {
        self.fs.copyTpl(
          self.templatePath(file.template),
          self.destinationPath(file.name),
          templateData
        );
      });
    },

    projectfiles: function() {
      this.fs.copy(
        this.templatePath('images/_logo.png'),
        this.destinationPath('images/logo.png')
      );
    }
  },

  install: function() {
    if (options.publishType == 'local') {
      this.installDependencies({
        skipInstall: this.options['skip-install'],
        callback: function() {
          this.spawnCommand('grunt');
        }.bind(this)
      });
    } else if (options.publishType == 'github') {
      var buildInfo = '\n\n\nTo build with travis, ' +
        '\n\n1. Signup or login with travis at https://travis-ci.org/' +
        '\n2. Go to https://travis-ci.org/profile/ and flick the switch on next to ' + options.publishUsername+'/'+options.publishRepo +
        '\n3. Push the current directory to https://github.com/' + options.publishUsername + '/' + options.publishRepo + '.git' +
        '\n\n--- Travis is now configured to forever publish your docbase site on gh-pages branch---' +
        '\n\n4. You can see the travis builds at https://travis-ci.org/'+options.publishUsername+'/'+options.publishRepo+'/builds'+
        '\n5. Your docbase site is live at https://'+options.publishUsername+'.github.io/'+
        options.publishRepo;
      console.log(buildInfo);
    }
  }
});
