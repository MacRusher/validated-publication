import {Meteor} from 'meteor/meteor';
import {Match, check} from 'meteor/check';

export class ValidatedPublication {

    /**
     * Create new publication
     * @param {String} options.name - name of the publication
     * @param {Function[]} [options.mixins=[]] - mixins to enhance the publication
     * @param {Function} options.validate - function to validate arguments
     * @param {Function} options.run - publication body
     * @param {Object} [options.connection=Meteor]
     */
    constructor(options) {

        // Default values
        _.defaults(options, {
            mixins: [],
            connection: Meteor
        });

        // Verify initial options (one at a time for easier debugging)
        check(options.name, String);
        check(options.mixins, [Function]);
        check(options.connection, Object);

        // Let the mixins do the magic
        options = applyMixins(options, options.mixins);

        // You can pass null to skip validation
        if (options.validate === null) {
            options.validate = () => {};
        }

        // Final verification (one at a time for easier debugging)
        check(options.name, String);
        check(options.mixins, [Function]);
        check(options.validate, Function);
        check(options.run, Function);
        check(options.connection, Object);

        // Attach all options to the instance
        Object.assign(this, options);

        const publication = this;

        // Create the real publication
        this.connection.publish(this.name, function (args) {
            // Silence audit-argument-checks since arguments are always checked when using this package
            check(args, Match.Any);
            return publication._execute(this, args);
        });
    }

    _execute(invocation = {}, args = {}) {
        // Add `this.name` to reference the publication name
        invocation.name = this.name;

        const validateResult = this.validate.bind(invocation)(args);

        if (typeof validateResult !== 'undefined') {
            throw new Error(`Returning from validate doesn't do anything; perhaps you meant to throw an error?`);
        }

        return this.run.bind(invocation)(args);
    }
}

function applyMixins(options, mixins) {
    // Save name of the publication here, so we can attach it to potential error messages
    const {name} = options;

    // You can pass nested arrays so that people can ship mixin packs
    _.flatten(mixins).forEach(mixin => {
        options = mixin(options);

        if (!Match.test(options, Object)) {
            const functionName = mixin.toString().match(/function\s(\w+)/);
            const msg = functionName ? `The function '${functionName[1]}'` : 'One of the mixins';

            throw new Error(`Error in ${name} publication: ${msg} didn't return the options object.`);
        }
    });

    return options;
}