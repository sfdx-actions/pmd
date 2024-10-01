const core = require('@actions/core')
const exec = require('child_process').exec

try {
  installPMD()
} catch (error) {
  core.setFailed(error.message)
}

function installPMD(){
  var download = 'wget https://github.com/pmd/pmd/releases/download/pmd_releases%2F7.6.0/pmd-dist-7.6.0-bin.zip -P /tmp'
  var unzip = 'unzip /tmp/pmd-bin-6.19.0.zip -d /tmp'
  var mk = 'mkdir $HOME/pmd'
  var mv = 'mv /tmp/pmd-bin-6.19.0/* $HOME/pmd'
  exec(download+' && '+unzip+' && '+mk+' && '+mv, function(error, stdout, stderr){
    if(error) core.setFailed(stderr)
    core.debug(stdout)
    referencePMD()
  })
}

function referencePMD(){
  var mk = 'sudo mkdir -p /snap/bin && sudo chmod -R 757 /snap/bin'
  var cmd = 
`sudo echo '#! /bin/bash
$HOME/pmd/bin/run.sh pmd "$@"' > /snap/bin/pmd`
  var cm = 'chmod +x /snap/bin/pmd'
  exec(mk+' && '+cmd+' && '+cm, function(error, stdout, stderr){
    if(error) core.setFailed(stderr)
    core.debug(stdout)
  })
}
