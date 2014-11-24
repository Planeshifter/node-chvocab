(function() {
  var chvocab, corpus, data, delim, extractConcepts, fs, mime, mime_type, program;

  program = require('commander');

  mime = require('mime');

  fs = require('fs');

  chvocab = require('./load');


  /*
  Command-Line-Interface:
   */

  extractConcepts = function(corpus) {
    var res;
    return res = Promise.all(corpus.map((function(_this) {
      return function(doc) {
        return chvocab.analyze(doc);
      };
    })(this))).then((function(_this) {
      return function(data) {
        var outputJSON;
        console.log(data);
        outputJSON = program.pretty ? JSON.stringify(data, null, 2) : JSON.stringify(data);
        if (program.output) {
          return fs.writeFileSync(program.output, outputJSON);
        } else {
          return console.log(outputJSON);
        }
      };
    })(this));
  };

  program.version('0.1.1').option('-i, --input [value]', 'Load data from disk').option('-l, --list <items>', 'A list of input texts').option('-o, --output [value]', 'Write results to file').option('-d, --delim [value]', 'Delimiter to split text into documents').option('-p, --pretty', 'Pretty print of JSON output').parse(process.argv);

  corpus;

  delim = program.delim;

  if (program.list) {
    delim = delim || ";";
    corpus = program.list.split(delim);
    extractConcepts(corpus);
  } else if (program.input) {
    data = fs.readFileSync(program.input);
    mime_type = mime.lookup(program.input);
    switch (mime_type) {
      case "text/plain":
        delim = delim || " ";
        corpus = String(data).replace(/\r\n?/g, "\n").split(delim).clean("");
        extractConcepts(corpus);
        break;
      case "text/csv":
        csv.parse(String(data), (function(_this) {
          return function(err, output) {
            corpus = output.map(function(d) {
              return d[0];
            });
            return extractConcepts(corpus);
          };
        })(this));
    }
  }

}).call(this);
