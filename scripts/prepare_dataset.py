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

EXPERIMENTS_CONTAINER_URL = "https://bachbot.blob.core.windows.net/experiments"
#EXPERIMENTS_CONTAINER_URL = "."

experimentName = path.basename(path.dirname(path.abspath(__file__))) # current dir

experiment = dict()
experiment['id'] = experimentName
experiment['questions'] = json.load(open('questions.json', 'r'))
for _, group in experiment['questions'].items():
    for q in group:
        for k, fname in q.items():
            q[k] = path.join(EXPERIMENTS_CONTAINER_URL, experimentName, fname)

with open('experiment.json', 'w') as fd:
    print json.dumps(experiment, indent=4)
    json.dump(experiment, fd)

