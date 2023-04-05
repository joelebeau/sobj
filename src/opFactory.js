const Op = require("./op");

module.exports = OpFactory;

// We create a factory because directly subclassing does not allow
// us to properly override and isolate changes to class attributes.
//
// Any new class attributes added to an Op should be declared here
// unless there is a good reason to do so elsewhere.
function OpFactory({ parent = Op, fields, validations, outputs } = {}) {
  const fieldsArray = [...(fields || [])];
  const validationsArray = [...(validations || [])];
  const outputsArray = [...(outputs || [])];

  const parentFieldsArray = [...(parent.fields || [])];
  const parentValidationsArray = [...(parent.validations || [])];
  const parentOutputsArray = [...(parent.outputs || [])];

  return class extends parent {
    // Set of input field names
    static fields = new Set([...parentFieldsArray, ...fieldsArray]);

    // Array of validation functions to be run
    static validations = [...parentValidationsArray, ...validationsArray];

    // Declared set of fields to be output by the Op
    static outputs = new Set([...parentOutputsArray, ...outputsArray]);
  };
}
