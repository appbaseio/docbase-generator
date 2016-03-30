'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var options = {};
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
    var sourceQuestion = [
    {
      type: 'input',
      name: 'start',
      message: 'Press enter to begin'
    }, {
        type: 'list',
        name: "hostType",
        default: 'example',
        required: true,
        message: '1. Choose a location for your .md files',
        choices: [{
          name: 'Example',
          value: 'example'
        }, {
          name: 'Filesystem (example docs available)',
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
          default: 'docs',
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
        example: []
    }

    // 2. Publish Questions
    var publishQuestions = [{
        type: 'list',
        name: "publishType",
        default: 'local',
        required: false,
        message: "2. Choose a method to publish Docbase",
        choices: [{
          name: 'Github (with travis integration)',
          value: 'github'
        }, {
          name: 'Local',
          value: 'local'
        }]
      }];

    var publishSubQuestions = {
        github: [
         {
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

    // 3. Type Question
    var typeQuestion = [{
        type: 'list',
        name: 'mode',
        message: '3. Choose a mode to serve your docs',
        default: 'SPA',
        choices: [{
          name: 'Single Page App (SPA)',
          value: 'SPA'
        }, {
          name: 'HTML',
          value: "HTML"
        }]
      } //prompt user to answer questions
    ];

    // 4/ Ask for theme
    var themePrompts = [{
      type: 'input',
      name: 'primaryColor',
      message: '4. [Optional] Choose a primary color for the theme',
      default: '#50BAEF',
      required: false
    }];

    var self = this;
    self.prompt(sourceQuestion, function(propsSource) {
      self.prompt(sourceSubQuestion[propsSource.hostType || 'file'], function(propsHostType) {

        self.prompt(publishQuestions, function(propsPublish) {
          if (propsPublish.publishType == 'github' && propsSource.hostType != 'github') {
            self.prompt(publishSubQuestions[propsPublish.publishType || 'local'], function(propsSubPublish) {

              self.propsInSource = _.assign(propsHostType, propsSource);
              self.propsInPublish = _.assign(propsSubPublish, propsPublish);
              self.props = _.merge(self.propsInSource, self.propsInPublish);
              if(self.props.hostType === 'example') {
                self.props.hostType = 'file';
                self.props.basePath = 'docs';
              }
              typeQuestionApply(self);
            });
          }
          else {

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
      self.prompt(typeQuestion, function(propsTypes) {
        self.prompt(themePrompts, function(propsTheme) {
          self.props['mode'] = propsTypes.mode;
          self.props['primaryColor'] = propsTheme.primaryColor;
          done();
        });
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
        'template': 'docs/v1/sample/_sample1.md',
        'name': 'docs/v1/sample/sample1.md'
      }, {
        'template': 'docs/v1/howtostart/_starting.md',
        'name': 'docs/v1/howtostart/starting.md'
      }, {
        'template': 'docs/v2/sample/_sample1.md',
        'name': 'docs/v2/sample/sample1.md'
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
        'template': 'images/_docbase.png',
        'name': 'images/docbase.png'
      }, {
        'template': '_getGitMap.html',
        'name': 'getGitMap.html'
      }, {
        'template': '_.travis.yml',
        'name': '.travis.yml'
      }, {
        'template': 'docs_html/readme.md',
        'name': 'docs_html/readme.md'
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
        publishType: "",
        gruntTarget: ""
      };
      options = _.assign(defaultOptions, this.props);
      options.generateSearchIndex = true;
      options.generateHtml = options.mode === 'HTML';
      options.githubAccess_token = new Buffer(options.githubAccess_token).toString('base64');
      options.baseFolder = options.mode === 'HTML' ? 'docs_html' : 'spa';
      var publishRepoLink = "'https://' + new Buffer(process.env.DOCBASE_TOKEN, 'base64').toString() + '@github.com/" + options.publishUsername + "/" + options.publishRepo + ".git'";
      options.publishRepoLink = options.publishType == 'github' ? publishRepoLink : "''";
      options.gruntOperation = options.publishType == 'github' ? 'parallel' : 'series';
      options.gruntTarget = options.mode == 'HTML' ? 'def' : 'spa';

      console.log(options);

      var self = this;
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
        this.templatePath('images/_docbase.png'),
        this.destinationPath('images/docbase.png')
      );
    }
  },

  install: function() {
    if (options.publishType == 'local') {
      this.installDependencies({
        skipInstall: this.options['skip-install'],
        callback: function() {
          if (options.mode === 'HTML')
            this.spawnCommand('grunt');
          else
            this.spawnCommand('grunt', ['spa']);
        }.bind(this)
      });
    } else if (options.publishType == 'github') {
      var buildInfo = '\n\n\nTo build with travis, ' +
        '\n\n1. Signup or login with travis at https://travis-ci.org/' +
        '\n2. Add the https://github.com/' + options.publishUsername + '/' + options.publishRepo + '.git repository to travis by clicking "(+) add repository" button' +
        '\n3. Turn the switch on to publish your repository' +
        '\n4. Push the current directory to https://github.com/' + options.publishUsername + '/' + options.publishRepo + '.git' +
        '\n\n--- Travis is now forever configured to serve docbase from gh-pages branch---' +
        '\n\n5. You should see the travis builds at https://travis-ci.org/'+options.publishUsername+'/'+options.publishRepo+'/builds'+
        '\n6. Check out your live docs at https://'+options.publishUsername+'.github.io/'+
        options.publishRepo;
      console.log(buildInfo);
    }
  }
});
