#!/bin/bash

chmod +x umodel/linux/umodel

SCRIPT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)

if [$LD_LIBRARY_PATH -eq '']
then
  echo 'no ld'
fi

#export LD_LIBRARY_PATH=$LD_LIBRARY_PATH;$SCRIPT_DIR/umodel/linux
#apt install wget 
#// ensure that the libraries are available locally
#execSync(`sudo apt install wget `)
