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
        message: 'What is your baseUrl',
      }, {
        type: 'input',
        name: 'basePath',
        message: 'What is your basePath',
        default: 'docs',
      }],
      file: [{
        type: 'input',
        name: 'basePath',
        message: 'What is your basePath',
        default: 'docs',
        required: false
      }],
      github: [{
        type: 'input',
        name: 'githubUser',
        message: 'What is the github User'
      }, {
        type: 'input',
        name: 'githubRepo',
        message: 'What is the documents repository'
      }, {
        type: 'input',
        name: 'githubPath',
        message: 'What is the path to the documents in the repository'
      }, {
        type: 'input',
        name: 'githubBranch',
        message: 'What is the branch to access the documents',
        "default": "master"
      }, {
        type: 'input',
        name: 'githubClient_id',
        message: 'What is github client id'
      }, {
        type: 'input',
        name: 'githubClient_secret',
        message: 'What is github secret key'
      }]
    };
    var geralPrompts = [{
        type: 'list',
        name: 'mode',
        message: 'Choose a execution mode',
        default: 'SPA',
        choices: [{
          name: 'HTML',
          value: "HTML"
        }, {
          name: 'Single-page application',
          value: 'SPA'
        }]
      }, //prompt user to answer questions
      {
        type: 'list',
        name: "hostType",
        default: 'file',
        required: false,
        message: "Choose how can we acessos your document",
        choices: [{
          name: 'Local file',
          value: 'file'
        }, {
          name: 'External URl',
          value: 'generic'
        }, {
          name: 'Github',
          value: 'github'
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
        githubClient_id: "",
        githubClient_secret: "",
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
