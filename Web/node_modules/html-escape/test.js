"use strict";

var test = require("tape");
var escape = require("./");

test("escaping", function(t) {
  t.equal(escape("no escape"), "no escape");
  t.equal(escape("foo&bar"), "foo&amp;bar");
  t.equal(escape("<tag>"), "&lt;tag>");
  t.equal(escape("test=\'foo\'"), "test=&apos;foo&apos;");
  t.equal(escape("test=\"foo\""), "test=&quot;foo&quot;");
  t.equal(escape("<ta'&g\">"), "&lt;ta&apos;&amp;g&quot;>");
  t.end();
});
