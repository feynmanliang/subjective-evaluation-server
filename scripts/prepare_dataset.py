#!/usr/bin/env python
"""
Usage:
    Copy this file into your experiment directory containing `questions.json`.
    Run this file.
    Upload the corresponding experiment.json and mp3s to Blob store.
"""

import json
from glob import glob
from os import path

#EXPERIMENTS_CONTAINER_URL = "https://bachbot.blob.core.windows.net/experiments"
EXPERIMENTS_CONTAINER_URL = "."

experimentName = path.basename(path.dirname(path.abspath(__file__))) # current dir

experiment = dict()
experiment['id'] = experimentName
experiment['questions'] = json.load(open('questions.json', 'r'))

with open('experiment.json', 'w') as fd:
    json.dump(experiment, fd)

