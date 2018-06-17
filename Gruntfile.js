module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        banner: '/* Auto-generated, don\'t edit this file */\n\n'
      },
      jsfiles_prod: {
        src: [
          'src/resources/js/lib/jquery-3.3.1.js',
          'src/resources/js/lib/vue/vue.min.js',
          'src/resources/js/lib/page.js',
          'src/resources/js/vue_mixins.js',
          'src/resources/js/vue_components.js',
          'src/resources/js/vue_app.js',
        ],
        dest: 'src/resources/js/<%= pkg.name %>.merged.js',
      },
      jsfiles_dev: {
        src: [
          'src/resources/js/lib/jquery-3.3.1.js',
          'src/resources/js/lib/vue/vue.js',
          'src/resources/js/lib/page.js',
          'src/resources/js/vue_mixins.js',
          'src/resources/js/vue_components.js',
          'src/resources/js/vue_app.js',
        ],
        dest: 'src/resources/js/<%= pkg.name %>.merged.js',
      },
      cssfiles: {
        src: 'src/resources/css/*.css',
        dest: 'dev/resources/css/<%= pkg.name %>.merged.css',
      }
    },
    cssmin: {
      options: {
        sourceMap: true
      },
      target: {
        files: {
          'dist/resources/css/<%= pkg.name %>.merged.min.css': ['src/resources/css/*.css', '!src/resources/css/*.min.css']
        }
      }
    },
    uglify: {
      options: {
        banner: '/* <%= pkg.name %> by <%= pkg.author %> */\n'
      },
      build: {
        src: '<%= concat.jsfiles_prod.dest %>',
        dest: 'dist/resources/js/<%= pkg.name %>.merged.min.js'
      }
    },
    copy: {
      dev: {
        files: [{
          expand: true,
          cwd: 'src/resources/img/',
          src: '**',
          dest: 'dev/resources/img/',
          flatten: true
        },{
          src: '<%= concat.jsfiles_dev.dest %>',
          dest: 'dev/resources/js/<%= pkg.name %>.merged.js'
        },{
          src: 'src/.htaccess',
          dest: 'dev/.htaccess'
        }]
      },
      prod: {
        files: [{
          expand: true,
          cwd: 'src/resources/img/',
          src: '**',
          dest: 'dist/resources/img/',
          flatten: true
        },{
          src: 'src/.htaccess',
          dest: 'dist/.htaccess'
        }]
      }
    },
    processhtml: {
      dev: {
        files: {
          'dev/index.html': ['src/index.html']
        }
      },
      prod: {
        files: {
          'dist/index.html': ['src/index.html']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-processhtml');

  grunt.registerTask('development', ['concat:jsfiles_dev', 'concat:cssfiles', 'copy:dev', 'processhtml:dev']);
  grunt.registerTask('production', ['concat:jsfiles_prod', 'cssmin', 'uglify', 'copy:prod', 'processhtml:prod']);
};
