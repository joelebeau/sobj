const Op = require("../src/op");

class NoPerformOp extends Op {}
class SimpleOp extends Op {
  perform() {
    this.output("foo", "bar");
  }
}

describe("Op", () => {
  describe("Perform", () => {
    test("throws error on submit when no perform declared", () => {
      expect(() => NoPerformOp.submit()).toThrow("Perform not defined");
    });
  });

  describe("Fields", () => {
    test("fields are accessible on the object", () => {
      const TestOp = class extends NoPerformOp {}

      TestOp.field("foo");
      TestOp.field("bar");

      foo = new TestOpClass({ foo: "fooInput", bar: "barInput", baz: "bazInput" });
      
      expect(foo.foo).toBe("fooInput");
      expect(foo.bar).toBe("barInput");
    });

    test("undeclared fields not accessible on the object", () => {
      const TestOp = NoPerformOp.field("foo");
      foo = new NoPerformOp({ foo: "fooInput", bar: "barInput" });

      expect(foo.bar).toBe(undefined);
    });
  });
});
