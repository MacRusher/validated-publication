# ValidatedPublication

## This package is currently work in progress

### Define Meteor publications in a structured way, with mixins

Heavily inspired by [mdg:validated-method](https://github.com/meteor/validated-method).

If you know and like `ValidatedMethod` you're gonna also like this package.

```
import {ValidatedPublication} from 'meteor/spaceapps:validated-publication';

const publication = new ValidatedPublication({
  name, // Publication name
  mixins, // Publication extensions
  validate, // argument validation
  run // Publication body, content of your usual Meteor.publish function
});
```

