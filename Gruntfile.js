
module.exports = function(grunt) {

  grunt.initConfig({
    pkg: {
      name: "danzimmjs"
    },
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['scripts/*.js'],
        dest: 'dist/script.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      dist: {
        files: {
          'dist/script.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },
    stylus: {
      compile: {
        options: {
          paths: ['styles/'],
          use: [
            require('autoprefixer-stylus')
          ]
        },
        files: {
          'dist/style.css': ['styles/*.styl']
        }
      }
    },
    watch: {
      scripts: {
        files: [
          'scripts/*.js'
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      styles: {
        files: [
          'styles/*.styl'
        ],
        tasks: [
          'stylus'
        ]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['concat', 'uglify', 'stylus']);

};
