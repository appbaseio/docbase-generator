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
    this.log(yosay(
      'Welcome to ' + chalk.red('GeneratorDocbase') + ' generator!'
    ));

    var hostTypeQuestions = {
      generic: [{
        type: 'input',
        name: 'baseUrl',
        message: 'Enter the root URL'
      }, {
        type: 'input',
        name: 'basePath',
        message: 'Enter the relative path from root URL'
      }],
      file: [{
        type: 'input',
        name: 'basePath',
        message: 'Enter the relative path from this directory where you will be adding the .md files',
        default: 'docs',
        required: false
      }],
      github: [{
        type: 'input',
        name: 'githubUser',
        message: 'Enter your github user or organization (e.g.: mojombo)'
      }, {
        type: 'input',
        name: 'githubRepo',
        message: 'Enter your github repository name (e.g.: Docs)'
      }, {
        type: 'input',
        name: 'githubBranch',
        message: 'Enter the branch name for this repository',
        default: 'master'
      }, {
        type: 'input',
        name: 'githubPath',
        message: 'Enter the relative path to the .md docs within the repository (e.g.: src)'
      }, {
        type: 'input',
        name: 'githubAccess_token',
        message: '[Optional] Provide your personal access token'
      }]
    };

    var publishTypeQuestions = {
      github: [{
        type: 'input',
        name: 'publishEmail',
        required: true,
        message: '[publish information] Enter the email which you use with github'
      }, {
        type: 'input',
        name: 'publishUsername',
        required: true,
        message: '[publish information] Enter the github username under which you want to publish'
      }, {
        type: 'input',
        name: 'publishRepo',
        required: true,
        message: '[publish information] Enter the github repository name under which you want to publish'
      }, {
        type: 'input',
        name: 'githubAccess_token',
        required: true,
        message: '[publish information] Provide github access token to build with travis and push on gh-pages'
      }],
      local: []
    };
    var geralPrompts = [{
        type: 'input',
        name: 'start',
        message: 'Press Enter to start generator'
      }, {
        type: 'list',
        name: 'mode',
        message: 'Choose an execution mode',
        default: 'SPA',
        choices: [{
          name: 'Single Page App (SPA)',
          value: 'SPA'
        }, {
          name: 'HTML',
          value: "HTML"
        }]
      }, //prompt user to answer questions
      {
        type: 'list',
        name: "hostType",
        default: 'file',
        required: false,
        message: "Choose a location for your .md files",
        choices: [{
          name: 'Filesystem (default templates)',
          value: 'file'
        }, {
          name: 'Github',
          value: 'github'
        }, {
          name: 'External URL (bitbucket, your server, etc.)',
          value: 'generic'
        }]
      }, //prompt user to answer questions
      {
        type: 'list',
        name: "publishType",
        default: 'local',
        required: false,
        message: "Choose where do you want to publish",
        choices: [{
          name: 'Github (travis build)',
          value: 'github'
        }, {
          name: 'Local',
          value: 'local'
        }]
      }
    ];

    var themePrompts = [{
      type: 'input',
      name: 'primaryColor',
      message: '[Optional] Enter the primary color of your theme',
      default: '#50BAEF',
      required: false
    }];


    this.prompt(geralPrompts, function(props) {
      this.prompt(hostTypeQuestions[props.hostType || 'file'], function(propsHostType) {
        this.props = _.assign(propsHostType, props);

        if (this.props.publishType == 'github') {
          if (this.props.hostType == 'github') {
            this.prompt(publishTypeQuestions.github[0], function(propsPublishType) {
              this.props['publishEmail'] = propsPublishType['publishEmail'];
              this.props['publishUsername'] = this.props['githubUser'];
              this.props['publishRepo'] = this.props['githubRepo'];
              
              this.prompt(themePrompts, function(propsIn) {
                this.props['primaryColor'] = propsIn['primaryColor'];
                done();
              }.bind(this));

            }.bind(this));
          } else {
            this.prompt(publishTypeQuestions[props.publishType || 'local'], function(propsPublishType) {

              if (props.publishType == 'github') {
                this.props['publishEmail'] = propsPublishType['publishEmail'];
                this.props['publishUsername'] = propsPublishType['publishUsername'];
                this.props['publishRepo'] = propsPublishType['publishRepo'];
                if (propsPublishType['githubAccess_token'] && propsPublishType['githubAccess_token'] != '') {
                  this.props['githubAccess_token'] = propsPublishType['githubAccess_token'];
                }
              }

              this.prompt(themePrompts, function(propsIn) {
                this.props['primaryColor'] = propsIn['primaryColor'];
                done();
              }.bind(this));

            }.bind(this));
          }
        } else {
          this.prompt(themePrompts, function(propsIn) {
            this.props['primaryColor'] = propsIn['primaryColor'];
            done();
          }.bind(this));
        }
        // To access props later use this.props.someOption;

      }.bind(this));

    }.bind(this));

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
        'template': 'styles/_theme.scss',
        'name': 'styles/theme.scss'
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
        publishEmail: "",
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
        '\n\n1) singup with travis at https://travis-ci.org/' +
        '\n2) add your repository to travis by clicking add (+) repository button' +
        '\n3) Turn the switch on for your publish repository' +
        '\n- So, travis is ready to build gh-pages for your repo. ' +
        '\n\n\n4) Now push the current directory to master branch of your publish repository.';
      console.log(buildInfo);
    }
  }
});