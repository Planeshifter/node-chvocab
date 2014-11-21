(function() {
  'use strict';
  var BPromise, chvData, column_names, csv, dataPath, es6, escapeStringRegexp, fs, getPositions, namespace, path, util, _;

  fs = require('fs');

  path = require('path');

  BPromise = require('bluebird');

  csv = BPromise.promisifyAll(require('csv'));

  _ = require('underscore');

  util = require('util');

  escapeStringRegexp = require('escape-string-regexp');

  es6 = require('es6-shim');

  dataPath = path.normalize(__dirname + "/../data/");

  chvData = fs.readFileSync(dataPath + 'CHV_concepts_terms_flatfile_20110204.tsv');

  column_names = ["CUI", "Term", "CHV_preferred_name", "UMLS_preferred_name", "Explanation", "UMLS_preferred", "CHV_preferred", "Disparaged", "Frequency_Score", "Context_Score", "CUI_Score", "Combo_Score", "Combo_Score_NoTopWords", "CHV_String_Id", "CHV_Concept_Id"];

  getPositions = function(substring, string) {
    var a, i;
    a = [];
    i = -1;
    string = string.toLowerCase();
    substring = substring.toLowerCase();
    while ((i = string.indexOf(substring, i + 1)) >= 0) {
      a.push(i);
    }
    return a;
  };

  namespace = {};

  namespace.getCHV = function(callback) {
    this.fChvData = csv.parseAsync(chvData, {
      delimiter: "\t",
      columns: column_names
    });
    return this.fChvData.nodeify(callback);
  };

  namespace.analyze = function(string, callback) {
    var candidateSet;
    candidateSet = new Set;
    this.getCHV();
    return this.fChvData.map((function(_this) {
      return function(el) {
        var matches, pattern, term;
        term = el.Term;
        pattern = new RegExp("(?:^|\\s|$)(" + escapeStringRegexp(term) + ")(?:^|\\s|$)", "gi");
        matches = string.match(pattern);
        if (matches !== null) {
          el.count = matches.length;
          el.positions = getPositions(term, string);
          return candidateSet.add(el);
        }
      };
    })(this)).then((function(_this) {
      return function() {
        var arr, res, used;
        res = [];
        candidateSet.forEach(function(value) {
          value.indices = value.positions.map(function(e) {
            var _i, _ref, _results;
            return (function() {
              _results = [];
              for (var _i = e, _ref = e + value.Term.length; e <= _ref ? _i <= _ref : _i >= _ref; e <= _ref ? _i++ : _i--){ _results.push(_i); }
              return _results;
            }).apply(this);
          });
          return res.push(value);
        });
        used = [];
        arr = [];
        res = res.sort(function(a, b) {
          return b.Term.length - a.Term.length;
        }).forEach(function(element) {
          var candidates, maxScore, num, o, selected, _i, _len, _ref;
          if (_.intersection(_.flatten(element.indices), used).length === 0) {
            candidates = res.filter(function(e) {
              return _.intersection(e.indices, element.indices).length > 0 && e.Term === element.Term;
            });
            maxScore = _.max(_.pluck(candidates, "Combo_Score_NoTopWords"));
            selected = candidates.filter(function(e) {
              return e.Combo_Score_NoTopWords === maxScore;
            })[0];
            _ref = _.flatten(selected != null ? selected.indices : void 0);
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              num = _ref[_i];
              used.push(num);
            }
            o = {};
            o.CUI = selected != null ? selected.CUI : void 0;
            o.Term = selected != null ? selected.Term : void 0;
            o.CHV_preferred_name = selected != null ? selected.CHV_preferred_name : void 0;
            o.UMLS_preferred_name = selected != null ? selected.UMLS_preferred_name : void 0;
            o.Explanation = selected != null ? selected.Explanation : void 0;
            o.Count = selected != null ? selected.count : void 0;
            o.Positions = selected != null ? selected.positions : void 0;
            return arr.push(o);
          }
        });
        return BPromise.all(arr).then(function(fArr) {
          return fArr.sort(function(a, b) {
            return a.Positions[0] - b.Positions[0];
          });
        }).nodeify(callback);
      };
    })(this));
  };

  module.exports = namespace;

}).call(this);
