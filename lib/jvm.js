"use strict";

var exists = require('fs').existsSync || require('path').existsSync;
var path = require('path');

/**
 windows: set MAPTALKS_JVM_LOCATION=C:\Program Files\Java\jdk1.8.0_66\jre\bin\server\jvm.dll
 linux: TODO: check whether this works under linux
 */
function find() {
    // check MAPTALKS_JVM_LOCATION
    var key = 'MAPTALKS_JVM_LOCATION';
    var location = process.env[key];
    if (location && exists(location)) {
        if (!path.isAbsolute(location)) {
            throw new Error('find jvm: location of jvm must be absolute path.');
        }
        return location;
    }
    // else, guess from JAVA_HOME
    key = 'JAVA_HOME';
    var javahome = process.env[key];
    if (!javahome || !exists(javahome)) {
        throw new Error('find jvm: "JAVA_HOME" not specified.');
    }
    var parts = [];
    parts.push(javahome);
    if (process.platform === 'win32') {
        parts.push('jre');
        parts.push('bin');
        parts.push('server');
        parts.push('jvm.dll');
    } else {
        parts.push('jre');
        parts.push('lib');
        if (process.arch === 'ia32') {
            parts.push('i386');
        } else {
            parts.push('amd64');
        }
        parts.push('server');
        parts.push('libjvm.so');
    }
    return parts.join(path.sep);
};

module.exports = {
    find: find
};
