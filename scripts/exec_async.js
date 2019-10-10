const exec = require('child_process').exec;

module.exports.execAsync = (command) => {

  return new Promise((resolve, reject) => {

    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }

      return resolve(stdout);
    })
  });
}
