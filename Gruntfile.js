module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            "my_target": {
                "files": {
                    'public/javascripts/libs.min.js': [
                        'public/javascripts/retina.min.js',
                    ],
                }
            }
        },
        cssmin: {
            compress: {
                files: {
                    'public/stylesheets/style.min.css': [
                        "public/stylesheets/style.css"
                    ],
                    'public/stylesheets/cv.min.css': [
                        "public/stylesheets/cv.css"
                    ],
                    'public/stylesheets/font-awesome.min.css': [
                        "public/stylesheets/font-awesome.css"
                    ]

                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('default', ['uglify', 'cssmin']);
}