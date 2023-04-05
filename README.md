# SObj

## Overview

SObj is an attempt at a JavaScript (s)ervice (obj)ect implementation. It is based largely on the [Subroutine Rubygem](https://github.com/guideline-tech/subroutine). I chose to also use the term "Op" here as well, as it is very succinct.

Service objects offer a fantastic way to chunk code into logical, testable pieces without cluttering models, controllers, or other layers. They can be re-used and composed to form complex chains, and they also help simplify things like ownership without going all-in on a service-oriented architecture. Many of the people I know who have used this pattern swear by it now.

This is not a complete implementation at this time, and it may change extensively. Use at your own risk. Field and input handling, in particular, currently use very naive implementations that will need to change.

## Example Usage

```javascript
const OpFactory = require("sobj");

// Note that we need proper `this` binding, so we cannot use arrow functions for validations.
function fooValidation() {
  if(this.foo != null) return;

  this.addError("foo must be provided");
}

class FooOp extends OpFactory({
  fields: ["foo", "bar"], // Will change in a future update
  validations: [fooValidation],
  outputs: ["baz"]
}) {
  perform() {
    this.output("baz", `${this.foo} ${this.bar}`);
  }
}

```

Usage of this new Op would look like this:

```javascript
const op = FooOp.submit({ foo: "Hello", bar: "world" });
op.outputs.baz; // op.baz == "Hello world"
```

Alternatively we can partially instantiate the op and submit later:

```javascript
const op = new FooOp({ foo: "Hello" });
op.submit({ bar: "world" });
op.outputs.baz; // "Hello world"
```

## Commentary

I got very comfortable with Subroutine's Op style while working in Ruby, but not everything carries over very well from Ruby into JavaScript. We can achieve similar results, but for one, this implementation is building from the ground up whereas the original Ruby implementation is built on top of ActiveModel. This means some concept needs to be engineered from the ground up, though it does afford us some freedom in that regard as well.

There are some major departures from the original implementation, and some minor ones. First, this version uses factories to create new ops to minimize any issues of child classes polluting the static attributes of their parent class. I also opted to have an explicit outputs object to avoid naming collisions with inputs. Other differences will almost certainly arise, apart from the more obvious ergonomic differences due to language differences.

## Major TODOs

- TypeCasters (Will require changes to field/input handling).
- Authorization
- Atomicity
- Safe version of submission
