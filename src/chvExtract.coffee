#!/usr/bin/env node
program = require 'commander'
mime = require 'mime'
fs = require 'fs'
chvocab = require './load'

###
Command-Line-Interface:
###

extractConcepts = (corpus) ->
  res = Promise.all(corpus.map((doc) => chvocab.analyze(doc))).then((data) =>
    console.log(data)
    outputJSON = if program.pretty then JSON.stringify(data, null, 2) else JSON.stringify(data)
    if program.output
      fs.writeFileSync(program.output, outputJSON)
    else
      console.log(outputJSON)
  )

program
  .version('0.1.1')
  .option('-i, --input [value]', 'Load data from disk')
  .option('-l, --list <items>','A list of input texts')
  .option('-o, --output [value]', 'Write results to file')
  .option('-d, --delim [value]','Delimiter to split text into documents')
  .option('-p, --pretty','Pretty print of JSON output')
  .parse(process.argv)

corpus
delim = program.delim
if program.list
  delim = delim or ";"
  corpus = program.list.split(delim)
  extractConcepts(corpus)
else if (program.input)
  data = fs.readFileSync(program.input)
  mime_type = mime.lookup(program.input)
  switch mime_type
    when "text/plain"
      delim = delim or " "
      corpus = String(data).replace(/\r\n?/g, "\n").split(delim).clean("")
      extractConcepts(corpus)
    when "text/csv"
      csv.parse(String(data), (err, output) =>
        corpus = output.map( (d) => d[0] )
        extractConcepts(corpus)
      )
