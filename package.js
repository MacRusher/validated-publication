/* global Package: false */

Package.describe({
    name: 'spaceapps:validated-publication',
    version: '0.1.0',
    summary: 'A simple wrapper for Meteor.publish, inspired by mdg:validated-method',
    git: 'git@github.com:MacRusher/validated-publication.git',
    documentation: 'README.md'
});

Package.onUse(api => {
    api.versionsFrom('1.3.2.4');
    api.use([
        'ecmascript',
        'check',
        'underscore'
    ]);
    api.mainModule('validated-publication.js');
});

Package.onTest(api => {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('spaceapps:validated-publication');
    api.mainModule('validated-publication-tests.js');
});
