
var Test = function() {
  let r = F.sequenced( () => 5 ).then( () => 4 ).then( () => 3 ).then( () => 2 ).then( () => 1 ).then( () => "Blast off!" )();
  console.log("Result = " + r + " success: " + (r === "Blast off!"));
};

