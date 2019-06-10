module.exports = function(grunt) {

// �÷����� ��
  [
    'grunt-exec'
  ].forEach(function(task){
    grunt.loadNpmTasks(task);   // grunt �÷����� ���
  });

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
      // grunt-exec �÷����� �۾� ��
      'exec': {
        // �Ϸ�Ʈ�� ��Ű¡ ����
        'x64-packager': {
          command: "electron-packager . TestApp --overwrite --asar --platform win32 --arch x64 --out dist/ --icon favicon.ico --ignore=.gitignore --ignore=Gruntfile.js --ignore=webpack.config.js --ignore=installer.js",
          stdout: true,
          stderr: true
        },
        // �Ϸ�Ʈ�� �ν��緯 ���� ����
        'x64-installer': {
          command: "node ./installer.js x64",
          stdout: true,
          stderr: true
        }
      }

  });

  // �۾� ���, �迭���� �ε��� ���ʷ� �÷����� �����۾��� ����
  grunt.registerTask('default', ['exec']);

};