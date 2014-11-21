'use strict'

fs = require 'fs'
path = require 'path'
BPromise = require 'bluebird'
csv =  BPromise.promisifyAll require 'csv'
_ = require 'underscore'
util = require 'util'
escapeStringRegexp = require 'escape-string-regexp'
es6 = require 'es6-shim'

dataPath = path.normalize __dirname + "/../data/"
chvData = fs.readFileSync(dataPath + 'CHV_concepts_terms_flatfile_20110204.tsv')
column_names = ["CUI","Term","CHV_preferred_name","UMLS_preferred_name","Explanation","UMLS_preferred",
                "CHV_preferred","Disparaged","Frequency_Score","Context_Score","CUI_Score","Combo_Score",
                "Combo_Score_NoTopWords","CHV_String_Id","CHV_Concept_Id"]

getPositions = (substring, string) ->
  a = []
  i = -1
  string = string.toLowerCase()
  substring = substring.toLowerCase()
  while((i=string.indexOf(substring, i+1)) >= 0)
    a.push(i)
  return a

namespace = {}

namespace.getCHV = (callback) ->
  @fChvData = csv.parseAsync(chvData, {
    delimiter: "\t",
    columns: column_names})
  return @fChvData.nodeify(callback)

namespace.analyze = (string, callback) ->
  candidateSet = new Set
  @getCHV()
  @fChvData.map( (el) =>
    term = el.Term
    pattern = new RegExp "(?:^|\\s|$)(" + escapeStringRegexp(term) + ")(?:^|\\s|$)", "gi"
    matches = string.match(pattern)
    if matches != null
      el.count = matches.length
      el.positions = getPositions(term, string)
      candidateSet.add el
  ).then( () =>
    res = []
    candidateSet.forEach( (value) =>
      value.indices = value.positions.map( (e) => [e..e+value.Term.length])
      res.push(value)
    )
    used = []
    arr = []
    res = res.sort( (a, b) =>
      b.Term.length - a.Term.length
    ).forEach( (element) =>
      if _.intersection( _.flatten(element.indices), used).length == 0
        candidates = res.filter( (e) => _.intersection(e.indices, element.indices).length > 0 && e.Term == element.Term )
        maxScore = _.max ( _.pluck candidates, "Combo_Score_NoTopWords" )

        selected = candidates.filter( (e) => e.Combo_Score_NoTopWords == maxScore)[0]
        for num in _.flatten selected?.indices
          used.push(num)

        o = {}
        o.CUI = selected?.CUI
        o.Term = selected?.Term
        o.CHV_preferred_name = selected?.CHV_preferred_name
        o.UMLS_preferred_name = selected?.UMLS_preferred_name
        o.Explanation = selected?.Explanation
        o.Count = selected?.count
        o.Positions = selected?.positions
        arr.push(o)
    )
    return BPromise.all(arr).then( (fArr) => fArr.sort (a, b) =>
      a.Positions[0] - b.Positions[0] ).nodeify(callback)
  )

module.exports = namespace
