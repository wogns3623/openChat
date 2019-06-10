module.exports = function(grunt) {

// 플러그인 명세
  [
    'grunt-exec'
  ].forEach(function(task){
    grunt.loadNpmTasks(task);   // grunt 플러그인 등록
  });

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
      // grunt-exec 플러그인 작업 명세
      'exec': {
        // 일렉트론 패키징 과정
        'x64-packager': {
          command: "electron-packager . TestApp --overwrite --asar --platform win32 --arch x64 --out dist/ --icon favicon.ico --ignore=.gitignore --ignore=Gruntfile.js --ignore=webpack.config.js --ignore=installer.js",
          stdout: true,
          stderr: true
        },
        // 일렉트론 인스톨러 빌드 과정
        'x64-installer': {
          command: "node ./installer.js x64",
          stdout: true,
          stderr: true
        }
      }

  });

  // 작업 등록, 배열내의 인덱스 차례로 플러그인 관련작업이 동작
  grunt.registerTask('default', ['exec']);

};