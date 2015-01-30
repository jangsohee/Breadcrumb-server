'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically, when needed
    require('jit-grunt')(grunt, {
        express: 'grunt-express-server',
        injector: 'grunt-asset-injector'
    });

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({
        // Project settings
        pkg: grunt.file.readJSON('./package.json'),

        yeoman: {
            // configurable paths
            client: require('./bower.json').appPath || 'client',
            dist: 'dist'
        },

        express: {
            options: {
                port: process.env.PORT || 9000
            },
            dev: {
                options: {
                    script: 'server/app.js',
                    debug: true
                }
            },
            prod: {
                options: {
                    script: 'dist/server/app.js'
                }
            }
        },

        open: {
            server: {
                url: 'http://localhost:<%= express.options.port %>'
            }
        },

        watch: {
            injectJS: {
                files: [
                    '<%= yeoman.client %>/{app,components}/**/*.js',
                    '!<%= yeoman.client %>/{app,components}/**/*.spec.js',
                    '!<%= yeoman.client %>/{app,components}/**/*.mock.js',
                    '!<%= yeoman.client %>/app/app.js'],
                tasks: ['injector:scripts']
            },
            injectCss: {
                files: [
                    '<%= yeoman.client %>/{app,components}/**/*.css'
                ],
                tasks: ['injector:css']
            },
            injectSass: {
                files: [
                    '<%= yeoman.client %>/{app,components}/**/*.{scss,sass}'],
                tasks: ['injector:sass']
            },
            sass: {
                files: [
                    '<%= yeoman.client %>/{app,components}/**/*.{scss,sass}'],
                tasks: ['sass', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                files: [
                    '{.tmp,<%= yeoman.client %>}/{app,components}/**/*.css',
                    '{.tmp,<%= yeoman.client %>}/{app,components}/**/*.html',
                    '{.tmp,<%= yeoman.client %>}/{app,components}/**/*.js',
                    '!{.tmp,<%= yeoman.client %>}{app,components}/**/*.spec.js',
                    '!{.tmp,<%= yeoman.client %>}/{app,components}/**/*.mock.js',
                    '<%= yeoman.client %>/assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
                ],
                options: {
                    livereload: 35790
                }
            },
            express: {
                files: [
                    'server/**/*.{js,json}'
                ],
                tasks: ['express:dev', 'wait'],
                options: {
                    livereload: 35790,
                    nospawn: true //Without this option specified express won't be reloaded
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= yeoman.dist %>/*',
                            '!<%= yeoman.dist %>/.git*',
                            '!<%= yeoman.dist %>/.openshift',
                            '!<%= yeoman.dist %>/Procfile'
                        ]
                    }
                ]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/',
                        src: '{,*/}*.css',
                        dest: '.tmp/'
                    }
                ]
            }
        },

        // Automatically inject Bower components into the app
        bowerInstall: {
            target: {
                src: '<%= yeoman.client %>/index.html',
                ignorePath: '<%= yeoman.client %>/',
                exclude: [/bootstrap-sass-official/, /bootstrap.js/, /bootstrap.css/, /font-awesome.css/ ]
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'sass'
            ]
        },

        env: {
            test: {
                NODE_ENV: 'test'
            },
            prod: {
                NODE_ENV: 'production'
            },
            all: {}
        },

        // Compiles Sass to CSS
        sass: {
            server: {
                options: {
                    loadPath: [
                        '<%= yeoman.client %>/bower_components',
                        '<%= yeoman.client %>/app',
                        '<%= yeoman.client %>/components'
                    ],
                    compass: false
                },
                files: {
                    '.tmp/app/app.css': '<%= yeoman.client %>/app/app.scss'
                }
            }
        },

        injector: {
            options: {

            },
            // Inject application script files into index.html (doesn't include bower)
            scripts: {
                options: {
                    transform: function (filePath) {
                        filePath = filePath.replace('/client/', '');
                        filePath = filePath.replace('/.tmp/', '');
                        return '<script src="' + filePath + '"></script>';
                    },
                    starttag: '<!-- injector:js -->',
                    endtag: '<!-- endinjector -->'
                },
                files: {
                    '<%= yeoman.client %>/index.html': [
                        ['{.tmp,<%= yeoman.client %>}/{app,components}/**/*.js',
                            '!{.tmp,<%= yeoman.client %>}/app/app.js',
                            '!{.tmp,<%= yeoman.client %>}/{app,components}/**/*.spec.js',
                            '!{.tmp,<%= yeoman.client %>}/{app,components}/**/*.mock.js']
                    ]
                }
            },
            // Inject component scss into app.scss
            sass: {
                options: {
                    transform: function (filePath) {
                        filePath = filePath.replace('/client/app/', '');
                        filePath = filePath.replace('/client/components/', '');
                        return '@import \'' + filePath + '\';';
                    },
                    starttag: '// injector',
                    endtag: '// endinjector'
                },
                files: {
                    '<%= yeoman.client %>/app/app.scss': [
                        '<%= yeoman.client %>/{app,components}/**/*.{scss,sass}',
                        '!<%= yeoman.client %>/app/app.{scss,sass}'
                    ]
                }
            },
            // Inject component css into index.html
            css: {
                options: {
                    transform: function (filePath) {
                        filePath = filePath.replace('/client/', '');
                        filePath = filePath.replace('/.tmp/', '');
                        return '<link rel="stylesheet" href="' + filePath + '">';
                    },
                    starttag: '<!-- injector:css -->',
                    endtag: '<!-- endinjector -->'
                },
                files: {
                    '<%= yeoman.client %>/index.html': [
                        '<%= yeoman.client %>/{app,components}/**/*.css'
                    ]
                }
            }
        }
    });

    // Used for delaying livereload until after server has restarted
    grunt.registerTask('wait', function () {
        grunt.log.ok('Waiting for server reload...');

        var done = this.async();

        setTimeout(function () {
            grunt.log.writeln('Done waiting!');
            done();
        }, 500);
    });

    grunt.registerTask('serve', function (target) {
         grunt.task.run([
             'clean:server',
             'env:all',
             'injector:sass',
             'concurrent:server',
             'injector',
             'bowerInstall',
             'autoprefixer',
             'express:dev',
             'wait',
             'open',
             'watch'
        ]);
    });
};
