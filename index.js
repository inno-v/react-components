'use strict';

var Hapi    = require('hapi');
var isDev   = process.env.NODE_ENV === 'development';
var min     = isDev ? '' : '.min';
var server  = new Hapi.Server(process.env.REACT_COMPONENTS_PORT || 3000);
var render  = require('app/react/renderer');
var pkgInfo = require('./package.json');
var tpl     = function(file) { return __dirname + '/templates/' + file + '.html'; };
var params = {
    'package': pkgInfo,
    'page': {
        description: pkgInfo.description,
        title: 'React Components'
    },
    'resources': {
        css: '/css/components.css',
        js: '/dist/bundle' + min + '.js'
    }
};

// Front page
server.route({
    method: 'GET',
    path: '/',
    handler: function(request, reply) {
        reply(render(
            params,
            tpl('default')
        ));
    }
});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'public',
            lookupCompressed: true
        }
    }
});

server.start(function() {
    console.log('Server running at:', server.info.uri);
});