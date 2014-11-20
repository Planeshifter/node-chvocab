fs = require 'fs'
path = require 'path'
BPromise = require 'bluebird'
csv =  BPromise.promisifyAll require 'csv'
_ = require 'underscore'
util = require 'util'

dataPath = path.normalize __dirname + "/../data/"
chvData = fs.readFileSync(dataPath + 'CHV_concepts_terms_flatfile_20110204.tsv')
column_names = ["CUI","Term","CHV_preferred_name","UMLS_preferred_name","Explanation","UMLS_preferred",
                "CHV_preferred","Disparaged","Frequency_Score","Context_Score","CUI_Score","Combo_Score",
                "Combo_Score_NoTopWords","CHV_String_Id","CHV_Concept_Id"]

namespace = {}

namespace.fChvData = csv.parseAsync(chvData, {
  delimiter: "\t",
  columns: column_names})

namespace.
