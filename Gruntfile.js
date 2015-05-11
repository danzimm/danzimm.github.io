
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
          'dist/script.min.js': ['dist/script.es5.js']
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
          'babel',
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
    },
    babel: {
      dist: {
        files: {
          'dist/script.es5.js': '<%= concat.dist.dest %>'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-babel');

  grunt.registerTask('default', ['concat', 'babel', 'uglify', 'stylus']);

};
