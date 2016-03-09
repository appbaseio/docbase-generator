'use strict';

var path = require('path');
var assert = require('yeoman-generator').assert;
var helpers = require('yeoman-generator').test;
var os = require('os');

describe('generator docbase:app', function () {
  before(function (done) {
    helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({ mode: 'HTML', hostType : 'file'})
      .withPrompts({hostType : 'file'})
      .on('end', done);
  });

  it('creates files', function () {
    assert.file([
    'bower.json',
    'package.json',
    'GruntFile.js',
    'index.html',
    'docbase-config.js',
    'html/main.html',
    'html/navbar.html',
    'docs/v1/howtostart/starting.md',
    'docs/v1/sample/sample1.md',
    'docs/v2/sample/sample1.md',
    'search-index.json',
    'styles/style.css',
    'images/docbase.png'
    ]);
  });
});
