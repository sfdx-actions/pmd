const core = require('@actions/core')
const exec = require('child_process').exec

try {
  let version = core.getInput('pmd-version');
  installPMD(version)
} catch (error) {
  core.setFailed(error.message)
}

function installPMD(version) {
  var download = `wget https://github.com/pmd/pmd/releases/download/pmd_releases%2F${version}/pmd-bin-${version}.zip -P /tmp`
  var unzip = `unzip /tmp/pmd-bin-${version}.zip -d /tmp`
  var mk = 'mkdir $HOME/pmd'
  var mv = `mv /tmp/pmd-bin-${version}/* $HOME/pmd`
  exec(download + ' && ' + unzip + ' && ' + mk + ' && ' + mv, function (error, stdout, stderr) {
    if (error) core.setFailed(stderr)
    core.debug(stdout)
    referencePMD()
  })
}

function referencePMD() {
  var mk = 'sudo mkdir -p /snap/bin && sudo chmod -R 757 /snap/bin'
  var cmd =
    `sudo echo '#! /bin/bash
$HOME/pmd/bin/run.sh pmd "$@"' > /snap/bin/pmd`
  var cm = 'chmod +x /snap/bin/pmd'
  exec(mk + ' && ' + cmd + ' && ' + cm, function (error, stdout, stderr) {
    if (error) core.setFailed(stderr)
    core.debug(stdout)
  })
}
