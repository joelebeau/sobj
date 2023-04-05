class Op {
  constructor({ ...inputs } = {}) {
    this.inputs = inputs;
    this.outputs = {};
    this.copyInputsToInstance();
    this.errors = [];
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
    this.copyInputsToInstance();
    this.validate();
    this.perform();
    this.validateOutputs();

    return this;
  }

  addError(message) {
    this.errors.push(message);
  }

  output(field, value) {
    if (!field in this.constructor.outputs) {
      throw new Error(
        `${field} is not declared as an output for ${this.constructor.name}`
      );
    }

    this.outputs[field] = value;
  }

  // This is to reduce verbosity and ensure that we are only working
  // with valid input fields, rather than working with a raw set of named inputs.
  copyInputsToInstance() {
    this.constructor.fields.forEach((field) => {
      this[field] = this[field] || this.inputs[field];
    });
  }

  isValid() {
    this.constructor.validations.forEach((validation) => validation.call(this));

    return !this.errors.length;
  }

  validate() {
    if (!this.isValid()) throw new Error(this.errors.join(", "));
  }

  validateOutputs() {
    const missingOutputs = [];
    this.constructor.outputs.forEach((output) => {
      if (!(output in this.outputs)) {
        missingOutputs.push(output);
      }
    });

    if (missingOutputs.length > 0) {
      throw new Error(`Missing outputs: ${missingOutputs.join(", ")}`);
    }
  }

  perform() {
    throw new Error("Perform not defined");
  }
}

module.exports = Op;
