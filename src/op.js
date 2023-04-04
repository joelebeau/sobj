class Op {
  constructor({ ...inputs } = {}) {
    this.inputs = inputs;
    this.constructor.fields.forEach(field => {
      this[field] = this[field] || this.inputs[field];
    });
    this.errors = [];
  }

  static fields = new Set(); // Array of input fields
  static validations = []; // Array of validation functions to be run
  static outputs = new Set(); // Declared set of fields to be output by the Op
  static output = {}; // Output fields and values

  static outputs(outputName) {
    this.outputs.add(outputName);
  }

  static field(fieldName) {
    this.fields.add(fieldName);
  }

  static submit(inputs) {
    const op = new this();

    return op.submit(inputs);
  }

  perform() {
    throw new Error("Perform not defined");
  }

  submit(inputs) {
    this.inputs = { ...this.inputs, ...inputs };
    // Map fields from `inputs` to accessors on the object instance.
    this.constructor.fields.forEach(field => {
      this[field] = this[field] || this.inputs[field];
    });

    // Execute validations
    this.constructor.validations.forEach(validation => validation.apply(this));
    if(this.errors.length > 1) {
      throw new Error(this.errors.join(", "));
    }

    this.perform();
  }

  output(field, value) {
    if(!inputs.has(field)) {
      throw new Error(`${field} is not declared as an output for ${this.constructor.name}`);
    }

    this.output[field] = value;
  }
}

module.exports = Op;
