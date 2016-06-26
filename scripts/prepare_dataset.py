#!/usr/bin/env python

import json
from glob import glob
from os import path

EXPERIMENTS_CONTAINER_URL = "https://bachbot.blob.core.windows.net/experiments"

experimentName = path.basename(path.dirname(path.abspath(__file__))) # current dir

config = dict()
config['id'] = experimentName
config['original'] = list()
config['generated'] = list()

for fname in glob("*.mp3"):
    sampleEntry = {
            'name': path.splitext(fname)[0],
            'url': EXPERIMENTS_CONTAINER_URL + '/' + experimentName + '/' + fname
            }
    sampleNum = int(fname[6:-4])
    if sampleNum <= 50: # original
        config['original'].append(sampleEntry)
    else: # generated
        config['generated'].append(sampleEntry)

print(json.dumps(config))
