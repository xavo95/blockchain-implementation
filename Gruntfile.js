module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                node: true
            },
            all: ['Gruntfile.js', 'app.js', 'middlewares/**/*.js', 'routes/**/*.js', 'controllers/**/*.js','models/**/*.js']
        },
        exec: {
            install_npm_main: 'npm install',
            run_express: 'node app.js'
        },
        // NOT USED YET
        nodeunit: {
            all: ['test/*_test.js']
        },
        mochaTest: {
            test: {
                options: {
                    useColors: true,
                    reporter: 'spec',
                    captureFile: 'results.txt',
                    quiet: false,
                    clearRequireCache: false,
                    noFail: false // Optionally set to not fail on failed tests (will still fail on other errors)
                },
                src: ['test/**/*.js']
            }
        }
    });

    // Load the plugin that provides the tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-mocha-test');

    // Task(s).
    grunt.registerTask('install_deps', ['exec:install_npm_main']);

    grunt.registerTask('build', ['jshint', 'mochaTest']);
    grunt.registerTask('run', ['install_deps', 'build', 'exec:run_express']);
    grunt.registerTask('default', ['run']);
};