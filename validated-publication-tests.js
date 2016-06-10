// Import Tinytest from the tinytest Meteor package.
import {Tinytest} from "meteor/tinytest";

// Import and rename a variable exported by validated-publication.js.
import {name as packageName} from "meteor/validated-publication";

// Write your tests here!
// Here is an example.
Tinytest.add('validated-publication - example', function (test) {
    test.equal(packageName, "validated-publication");
});
