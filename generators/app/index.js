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
    var geralPrompts = [{
        type: 'list',
        name: 'mode',
        message: 'Choose an execution mode',
        default: 'SPA',
        choices: [{
          name: 'HTML',
          value: "HTML"
        }, {
          name: 'Single Page App (SPA)',
          value: 'SPA'
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
        },  {
          name: 'Github',
          value: 'github'
        }, {
          name: 'External URL (bitbucket, your server, etc.)',
          value: 'generic'
        }]
      }
    ];

    this.prompt(geralPrompts, function(props) {
      this.prompt(hostTypeQuestions[props.hostType || 'file'], function(propsHostType) {
        this.props = _.assign(propsHostType, props);
        // To access props later use this.props.someOption;
        done();
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
          "name" : '.gitignore',
        },{
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
        },  {
          'template': 'docs/v1/sample/_sample1.md',
          'name': 'docs/v1/sample/sample1.md'
        },{
          'template': 'docs/v1/howtostart/_starting.md',
          'name': 'docs/v1/howtostart/starting.md'
        }, {
          'template': 'docs/v2/sample/_sample1.md',
          'name': 'docs/v2/sample/sample1.md'
        },{
          'template': '_search-index.json',
          'name': 'search-index.json'
        },
        {
          'template': 'styles/_style.css',
          'name': 'styles/style.css'
        },
        {
          'template': 'images/_docbase.png',
          'name': 'images/docbase.png'
        },
        {
          'template': '_getGitMap.html',
          'name': 'getGitMap.html'
        }
      ];
      var defaultOptions = {
        baseUrl: "",
        basePath: "",
        githubUser: "",
        githubPath: "",
        githubRepo: "",
        githubBranch: "",
        githubAccess_token: ""
      };
      options = _.assign(defaultOptions, this.props);
      options.generateSearchIndex = true;
      options.generateHtml = options.mode === 'HTML';
      
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
    this.installDependencies({
      skipInstall: this.options['skip-install'],
      callback: function () {
        if(options.mode === 'HTML')
          this.spawnCommand('grunt');
        else
          this.spawnCommand('grunt',['spa']);
      }.bind(this)
    });
  }
});
