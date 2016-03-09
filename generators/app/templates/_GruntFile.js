module.exports = function(grunt) {
	grunt.initConfig({
		docbase: {
			def: {
				options: {
					generatePath: "docs_html/",
					generateSearchIndex : true,
					generateHtml : <%= generateHtml %>,
					baseUrl: "./",
					urlToAccess: "http://localhost:9001/",
					assets: ['bower_components', 'styles', 'js', 'images', 'CNAME', 'map.json'],
					checkLoadedSelector : '#navbar-collapse',
				}
			}
		},
		connect: {
			server: {
				options: {
					port: 9001,
					base: './',
					protocol: 'http'
				}
			}
		},
		'gh-pages': {
			def: {
				options: {
					base: 'docs_html',
					user: {
						name: '',
						email: ''
					},
					repo: '',
					message: 'publish gh-pages (auto)',
					silent: false,
				},
				src: ['**']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-docbase');
	grunt.loadNpmTasks('grunt-gh-pages');
	// Default task.
	grunt.registerTask('default', ['connect', 'docbase']);
	grunt.registerTask('publish', ['connect', 'docbase', 'gh-pages']);

};
