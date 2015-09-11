'use strict';
var util = require('util'),
  yeoman = require('yeoman-generator'),
  fs = require('fs'),
  _ = require('lodash'),
  _s = require('underscore.string'),
  pluralize = require('pluralize');

var DashboardGenerator = module.exports = function DashboardGenerator(args, options, config) {
  // By calling `NamedBase` here, we get the argument to the subgenerator call
  // as `this.name`.
  yeoman.generators.NamedBase.apply(this, arguments);

  console.log('You called the entity subgenerator with the argument ' + this.name + '.');


  this.on('end', function() {
    //this.spawnCommand('bin/phpmig', ['migrate']);
    if (this.composer) {
      return this.spawnCommand('composer', ['update']);
    }
  });

  fs.readFile('generator.json', 'utf8', function(err, data) {
    if (err) {
      console.log('Error: ' + err);
      return;
    }
    this.generatorConfig = JSON.parse(data);
  }.bind(this));
};

util.inherits(SlimangularGenerator, yeoman.generators.NamedBase);

SlimangularGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  console.log('\nPlease specify an attribute:');

  var prompts = [{
    type: 'input',
    name: 'attrName',
    message: 'What is the name of the attribute (First Name, Last Name,...)?',
    default: 'myAttr'
  }, {
    type: 'list',
    name: 'attrType',
    message: 'What is the type of the attribute?',
    choices: ['String', 'Text', 'Char', 'Integer', 'Float', 'Boolean', 'Date', 'Enum', 'Email', 'Password'],
    default: 'String'
  }, {
    when: function(props) {
      return (/Char/).test(props.attrType);
    },
    type: 'input',
    name: 'minLength',
    message: 'Enter the minimum length for the Char attribute, or hit enter:',
    validate: function(input) {
      if (input && isNaN(input)) {
        return "Please enter a number.";
      }
      return true;
    }
  }, {
    when: function(props) {
      return (/Char/).test(props.attrType);
    },
    type: 'input',
    name: 'maxLength',
    message: 'Enter the maximum length for the Char attribute, or hit enter:',
    validate: function(input) {
      if (input && isNaN(input)) {
        return "Please enter a number.";
      }
      return true;
    }
  }, {
    when: function(props) {
      return (/String/).test(props.attrType);
    },
    type: 'input',
    name: 'minLength',
    message: 'Enter the minimum length for the String attribute, or hit enter:',
    validate: function(input) {
      if (input && isNaN(input)) {
        return "Please enter a number.";
      }
      return true;
    }
  }, {
    when: function(props) {
      return (/String/).test(props.attrType);
    },
    type: 'input',
    name: 'maxLength',
    message: 'Enter the maximum length for the String attribute, or hit enter:',
    validate: function(input) {
      if (input && isNaN(input)) {
        return "Please enter a number.";
      }
      return true;
    }
  }, {
    when: function(props) {
      return (/Text/).test(props.attrType);
    },
    type: 'input',
    name: 'minLength',
    message: 'Enter the minimum length for the Text attribute, or hit enter:',
    validate: function(input) {
      if (input && isNaN(input)) {
        return "Please enter a number.";
      }
      return true;
    }
  }, {
    when: function(props) {
      return (/Text/).test(props.attrType);
    },
    type: 'input',
    name: 'maxLength',
    message: 'Enter the maximum length for the Text attribute, or hit enter:',
    validate: function(input) {
      if (input && isNaN(input)) {
        return "Please enter a number.";
      }
      return true;
    }
  }, {
    when: function(props) {
      return (/Integer|Float/).test(props.attrType);
    },
    type: 'input',
    name: 'min',
    message: 'Enter the minimum value for the numeric attribute, or hit enter:',
    validate: function(input) {
      if (input && isNaN(input)) {
        return "Please enter a number.";
      }
      return true;
    }
  }, {
    when: function(props) {
      return (/Integer|Float/).test(props.attrType);
    },
    type: 'input',
    name: 'max',
    message: 'Enter the maximum value for the numeric attribute, or hit enter:',
    validate: function(input) {
      if (input && isNaN(input)) {
        return "Please enter a number.";
      }
      return true;
    }
  }, {
    when: function(props) {
      return (/Date/).test(props.attrType);
    },
    type: 'list',
    name: 'dateConstraint',
    message: 'Constrain the date as follows:',
    choices: ['None', 'Past dates only', 'Future dates only'],
    filter: function(input) {
      if (/Past/.test(input)) return 'Past';
      if (/Future/.test(input)) return 'Future';
      return '';
    },
    default: 'None'
  }, {
    when: function(props) {
      return (/Enum/).test(props.attrType);
    },
    type: 'input',
    name: 'enumValues',
    message: 'Enter an enumeration of values, separated by commas'
  }, {
    type: 'confirm',
    name: 'required',
    message: 'Is the attribute required to have a value?',
    default: true
  }, {
    type: 'confirm',
    name: 'again',
    message: 'Would you like to enter another attribute or reenter a previous attribute?',
    default: true
  }];

  this.prompt(prompts, function(props) {
    this.attrs = this.attrs || [];
    var attrType = props.attrType;
    this.attrs = _.reject(this.attrs, function(attr) {
      return attr.attrName === props.attrName;
    });
    this.attrs.push({
      attrName: props.attrName,
      attrType: attrType,
      minLength: props.minLength,
      maxLength: props.maxLength,
      min: props.min,
      max: props.max,
      dateConstraint: props.dateConstraint,
      enumValues: props.enumValues ? props.enumValues.split(',') : [],
      required: props.required
    });

    if (props.again) {
      this.askFor();
    } else {
      cb();
    }
  }.bind(this));
};

SlimangularGenerator.prototype.files = function files() {

  this.baseName = this.generatorConfig.baseName;
  this.databaseType = this.generatorConfig.databaseType;
  this.hostName = this.generatorConfig.hostName;
  this.databaseName = this.generatorConfig.databaseName;
  this.userName = this.generatorConfig.userName;
  this.password = this.generatorConfig.password;
  this.entities = this.generatorConfig.entities;
  this.composer = this.generatorConfig.composer;
  this.entities = _.reject(this.entities, function(model) {
    return model.name === this.name;
  }.bind(this));
  this.entities.push({
    name: this.name,
    attrs: this.attrs
  });
  this.pluralize = pluralize;
  this.generatorConfig.entities = this.entities;
  this.generatorConfigStr = JSON.stringify(this.generatorConfig, null, '\t');


  var serverDir = 'server/'
  var configDir = serverDir + 'config/'
  var migrationsDir = configDir + 'migrations/'
  var modelsDir = serverDir + 'models/'
  var publicDir = 'public/';
  this.template('_generator.json', 'generator.json');
  this.template('models/_model.php', modelsDir + _s.capitalize(this.name) + '.php');
  this.template('../../app/templates/server/_app.php', serverDir + 'app.php');
  var d = new Date()
  var dateStr = '' + d.getFullYear() + (d.getMonth() + 1) + d.getDate() + d.getHours() + d.getMinutes() + d.getSeconds()
  this.template('config/migrations/_migration.php', migrationsDir + dateStr + '_Create' + _s.capitalize(pluralize(this.name)) + '.php');

  var publicCssDir = publicDir + 'css/';
  var publicJsDir = publicDir + 'js/';
  var publicViewDir = publicDir + 'views/';
  var publicEntityJsDir = publicJsDir + this.name + '/';
  var publicEntityViewDir = publicViewDir + this.name + '/';
  this.mkdir(publicEntityJsDir);
  this.mkdir(publicEntityViewDir);
  this.template('../../app/templates/public/_index.html', publicDir + 'index.html');
  this.template('public/js/_model-controller.js', publicEntityJsDir + this.name + '-controller.js');
  this.template('public/js/_model-router.js', publicEntityJsDir + this.name + '-router.js');
  this.template('public/js/_model-service.js', publicEntityJsDir + this.name + '-service.js');
  this.template('public/views/_models.html', publicEntityViewDir + pluralize(this.name) + '.html');
  this.template('public/views/_model-modal.html', publicEntityViewDir + this.name + '-modal.html');
};