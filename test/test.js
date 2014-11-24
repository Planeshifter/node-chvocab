var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var assert = chai.assert;
var expect = chai.expect;

var chvocab = require("../lib/load.js")

describe("Consumer Health Vocabulary", function(){
  var fCHV = chvocab.getCHV();
  this.timeout(10000);
  it("loads all data successfully", function(){
    return assert.eventually.equal(fCHV.then(function(dat){ return dat.length}), 158519);
  });
  it("stores data in Array",function(){
    return assert.eventually.isTrue(fCHV.then(function(dat){ return Array.isArray(dat)}),"Data stored in Array");
  });
  it("objects have all properties", function(){
    var fElem = fCHV.then(function(dat){ return dat[0]});

    var t1 =  assert.eventually.property(fElem,"CUI");
    var t2 =  assert.eventually.property(fElem,"Term");
    var t3 =  assert.eventually.property(fElem,"CHV_preferred_name");
    var t4 =  assert.eventually.property(fElem,"UMLS_preferred_name");
    var t5 =  assert.eventually.property(fElem,"Explanation");
    var t6 =  assert.eventually.property(fElem,"UMLS_preferred");
    var t7 =  assert.eventually.property(fElem,"CHV_preferred");
    var t8 =  assert.eventually.property(fElem,"Disparaged");
    var t9 =  assert.eventually.property(fElem,"Frequency_Score");
    var t10 =  assert.eventually.property(fElem,"Context_Score");
    var t11 =  assert.eventually.property(fElem,"CUI_Score");
    var t12 =  assert.eventually.property(fElem,"Combo_Score");
    var t13 =  assert.eventually.property(fElem,"Combo_Score_NoTopWords");
    var t14 =  assert.eventually.property(fElem,"CHV_String_Id");
    var t15 =  assert.eventually.property(fElem,"CHV_Concept_Id");
    return Promise.all([t1,t2,t3,t4,t5])
  });
});

describe("Analyze a String", function(){
 var fAnalyze = chvocab.analyze("Chronic kidney disease (CKD) is a progressive loss in renal function")
 it("returns an array of candidate concepts", function(){
   return assert.eventually.isTrue(fAnalyze.then(function(dat){ return Array.isArray(dat)}), "returns indeed an array");
 });
 it("attaches position and count information", function(){
   var fElem = fAnalyze.then(function(dat){ return dat[0]});
   var t1 = assert.eventually.property(fElem,"Count");
   var t2 = assert.eventually.property(fElem,"Positions");
   return Promise.all([t1,t2])
 });
});
