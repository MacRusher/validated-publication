Package.describe({
    name: 'macrusher:validated-publication',
    version: '0.1.0',
    summary: 'A simple wrapper for Meteor.publish, inspired by mdg:validated-method',
    git: 'git@github.com:MacRusher/validated-publication.git',
    documentation: 'README.md'
});

Package.onUse(function (api) {
    api.versionsFrom('1.3.2.4');
    api.use([
        'ecmascript',
        'check',
        'underscore'
    ]);
    api.mainModule('validated-publication.js');
});

Package.onTest(function (api) {
    api.use('ecmascript');
    api.use('tinytest');
    api.use('macrusher:validated-publication');
    api.mainModule('validated-publication-tests.js');
});
