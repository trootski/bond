const deepCopyAndLowerCaseProps = function(inObject) {
  let outObject, value, key

  if(typeof inObject !== "object" || inObject === null) {
    return inObject;
  }
  outObject = Array.isArray(inObject) ? [] : {}
  for (key in inObject) {
    value = inObject[key];
    outObject[key.toLowerCase()] = (typeof value === "object" && value !== null) ? deepCopyAndLowerCaseProps(value) : value;
  }
  return outObject;
};

module.exports = {
  deepCopyAndLowerCaseProps,
};
