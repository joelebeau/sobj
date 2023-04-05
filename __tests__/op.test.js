const OpFactory = require("../src/opFactory");

describe("Op", () => {
  describe("Perform", () => {
    test("throws error on submit when no perform declared", () => {
      const TestOp = OpFactory();

      expect(() => TestOp.submit()).toThrow("Perform not defined");
    });
  });

  describe("Fields", () => {
    test("fields are accessible on the object", () => {
      const TestOp = OpFactory({
        fields: ["foo", "bar"],
      });

      foo = new TestOp({ foo: "fooInput", bar: "barInput" });

      expect(foo.foo).toBe("fooInput");
      expect(foo.bar).toBe("barInput");
    });

    test("undeclared fields not accessible on the object", () => {
      const TestOp = OpFactory({
        fields: ["foo"],
      });

      foo = new TestOp({ foo: "fooInput", bar: "barInput" });

      expect(foo.bar).toBe(undefined);
    });
  });

  describe("Validations", () => {
    function fooPresenceValidation() {
      if (this.foo != null) return;

      this.addError("foo must be provided");
    };

    const TestOp = class extends OpFactory({
      fields: ["foo"],
      validations: [fooPresenceValidation],
    }) {
      perform() {
        return "success";
      }
    };

    test("passing validations allow submision", () => {
      // No assertion necessary, so long as it doesn't throw
      TestOp.submit({ foo: "bar" });
    });

    test("failing validations cause submit to throw", () => {
      expect(() => TestOp.submit()).toThrow("foo must be provided");
    });

    test("multiple failing validations", () => {
      function barPresenceValidation() {
        if (this.bar != null) return;

        this.addError("bar must be provided");
      }

      const TestOp2 = class extends OpFactory({
        parent: TestOp,
        fields: ["bar"],
        validations: [barPresenceValidation]
      }) {}

      expect(() => TestOp2.submit()).toThrow("foo must be provided, bar must be provided");
    });
  });

  describe("Outputs", () => {
    const TestOp = class extends OpFactory({
      fields: ["num1", "num2"],
      outputs: ["sum"],
    }) {
      perform() {
        this.output("sum", this.num1 + this.num2);
      }
    }

    test("outputs can be declared", () => {
      expect(TestOp.outputs.size).toBe(1)
      expect(Array.from(TestOp.outputs)).toEqual(expect.arrayContaining(["sum"]));
    });

    test("outputs are accessible on the instance after perform", () => {
      op = TestOp.submit({ num1: 1, num2: 2 });
      expect(op.outputs.sum).toBe(3);
    });

    test("it throws if output is not declared", () => {
      const BadOp = class extends OpFactory({ parent: TestOp }) {
        perform() {
          // Redeclare `perform`, but "accidentally" return instead of outputting result;
          return this.num1 + this.num2;
        }
      }

      expect(() => BadOp.submit({ num1: 1, num2: 2 })).toThrow("Missing outputs: sum");
    });
  });
});
