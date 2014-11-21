var chvocab = require("../lib/load.js");

// Source: http://en.wikipedia.org/wiki/Chronic_kidney_disease
abstract = "Chronic kidney disease (CKD), also known as chronic renal disease (CRD), is a progressive loss in renal function over a period of months or years. The symptoms of worsening kidney function are non-specific, and might include feeling generally unwell and experiencing a reduced appetite. Often, chronic kidney disease is diagnosed as a result of screening of people known to be at risk of kidney problems, such as those with high blood pressure or diabetes and those with a blood relative with chronic kidney disease. Chronic kidney disease may also be identified when it leads to one of its recognized complications, such as cardiovascular disease, anemia or pericarditis. It is differentiated from acute kidney disease in that the reduction in kidney function must be present for over 3 months."

chvocab.analyze(abstract, function(err, data){
  console.log(data)
})
