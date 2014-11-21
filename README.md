[![NPM version](https://badge.fury.io/js/chvocab.svg)](http://badge.fury.io/js/chvocab)
[![Build Status](https://travis-ci.org/Planeshifter/node-chvocab.svg)](https://travis-ci.org/Planeshifter/node-chvocab)

CHV Concept Extractor
============

This is a small utility tool to extract UMLS concepts in supplied input texts via the Consumer Health Vocabulary (CHV). 

# Installation

Install via npm:

```
npm install chvocab
```

## Getting Started

The packages exports a namespace with two functions:

### analyze(string, [callback])

The first parameter expects the text to be analyzed, and the second parameter is a callback function which gets passed the result set of concepts identified in the CHV. The function chooses only one concept for each word phrase via the following algorithm: 

1. If there are different candidates for a word phrase in CHV, the longest one is picked pickd. For example, if the phrase "heart attack" appears in the supplied string, the candidate set of UMLS concepts would comprise the concepts `heart`, `attack` and `heart attack` with the latter concept being returned. 
2. For candidates of equal length, the one with the highest familiarity score in the CHV is chosen.

Example:
```
input = "Chronic Kidney Disease is a progressive loss in renal function" 
chvocab.analyze(input, function(err, data){
  console.log(data)
})
```

Output: 
```
[ { CUI: 'C0205191',
    Term: 'chronic',
    CHV_preferred_name: 'chronic (qualifier value)',
    UMLS_preferred_name: 'chronic',
    Explanation: '',
    Count: 1,
    Positions: [ 0 ] },
  { CUI: 'C0022658',
    Term: 'kidney disease',
    CHV_preferred_name: 'kidney diseases',
    UMLS_preferred_name: 'kidney disease',
    Explanation: '',
    Count: 1,
    Positions: [ 8 ] },
  { CUI: 'C0205329',
    Term: 'progressive',
    CHV_preferred_name: 'progressive (qualifier value)',
    UMLS_preferred_name: 'progressive',
    Explanation: '',
    Count: 1,
    Positions: [ 28 ] },
  { CUI: 'C0232804',
    Term: 'renal function',
    CHV_preferred_name: 'renal function, nos',
    UMLS_preferred_name: 'kidney function',
    Explanation: '',
    Count: 1,
    Positions: [ 48 ] } ]
```

### getCHV([callback])

If one would like to use the CHV data for a different purpose, one can access it via this function. As soon as the data set is loaded, the callback function is invoked. This function has parameters `err, data`, of which the latter one holds the data set provided it was successfully loaded into memory. 

Instead of using the callback style, one can work with Promises since both functions also return a Promise implemented via the `bluebird` package. 

## Command Line Interface

Install the package globally to access the command line tool from everywhere:

```
npm install chvocab -g
```

Then you can simply invoke `chvExtract` from the terminal. Type `chvExtract --help` to see the different options of how you can input data and retrieve the extracted results.

If you prefer to not install the package globally, you can access the command-line utility via

```
node lib/chvExtract.js
```

### License 

The Consumer Health Vocabulary (CHV) is developed by
[Consumer Health Vocabulary Initiative](http://consumerhealthvocab.org/), an on-going collaboration among researchers from a number of institutions including the
University of Utah, Brigham and Women's Hospital, Harvard Medical School, National Library
of Medicine, and University of Wisconsin. It is licensed under the GNU GENERAL PUBLIC LICENSE, Version 2 and
consequently this package is also licensed under GPL-2.
