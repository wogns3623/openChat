var createInstaller = require('electron-installer-squirrel-windows');

createInstaller({
  name : 'TestApp',
  path: './dist/electron-quick-start-win32-x64',
  out: './dist/installer',
  authors: 'creamyCode',
  exe: 'TestApp.exe',
  appDirectory: './dist/electron-quick-start-win32-x64',
  overwrite: true
}, function done (e) {
  console.log('Build success !!');
});