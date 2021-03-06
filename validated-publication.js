import {Meteor} from 'meteor/meteor';
import {Match, check} from 'meteor/check';
import {_} from 'meteor/underscore';

/**
 * Create new publication
 * @param {{}} options - publication configuration
 * @param {String} options.name - name of the publication
 * @param {Function[]} [options.mixins=[]] - mixins to enhance the publication
 * @param {Function} options.validate - function to validate arguments
 * @param {Function} options.run - publication body
 * @param {Function} [options.publishMethod=Meteor.publish] - Method used for actual publication
 */
export class ValidatedPublication {

    constructor (options = {}) {

        // Apply default values
        _.defaults(options, {
            mixins: [],
            publishMethod: Meteor.publish
        });

        // Verify initial options
        if (!Match.test(options.name, String)) {
            throw new Error('ValidatedPublication require a name');
        }
        if (!Match.test(options.mixins, [Function])) {
            throw new Error(`Mixins must be an array of functions for ValidatedPublication named ${options.name}`);
        }
        if (!Match.test(options.publishMethod, Function)) {
            throw new Error(`You need to provide publishMethod for ValidatedPublication named ${options.name}`);
        }

        // Let the mixins do the magic
        options = applyMixins(options, options.mixins);

        // You can pass null to skip validation
        if (options.validate === null) {
            options.validate = () => {};
        }

        // Final verification, mixins may broke something
        if (!Match.test(options.name, String)) {
            throw new Error('ValidatedPublication require a name');
        }
        if (!Match.test(options.mixins, [Function])) {
            throw new Error(`Mixins must be an array of functions for ValidatedPublication named ${options.name}`);
        }
        if (!Match.test(options.validate, Function)) {
            throw new Error(`You need to provide a validate function for ValidatedPublication named ${options.name}`);
        }
        if (!Match.test(options.run, Function)) {
            throw new Error(`You need to provide a run function for ValidatedPublication named ${options.name}`);
        }
        if (!Match.test(options.publishMethod, Function)) {
            throw new Error(`You need to provide publishMethod for ValidatedPublication named ${options.name}`);
        }

        // Attach all options to the instance
        Object.assign(this, options);

        const publication = this;

        // Create the real publication
        this.publishMethod(this.name, function validatedPublication (args) {
            // Silence audit-argument-checks since arguments are always checked when using this package
            check(args, Match.Any);
            return publication._execute(this, args);
        });
    }

    _execute (invocation = {}, args = {}) {
        // Add `this.name` to reference the publication name
        invocation.name = this.name;

        const validateResult = this.validate.bind(invocation)(args);

        if (typeof validateResult !== 'undefined') {
            throw new Error(`Validate function should not return a value. Check ValidatedMethod named ${this.name}`);
        }

        return this.run.bind(invocation)(args);
    }
}

function applyMixins (options, mixins) {
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