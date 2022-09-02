#!/bin/bash

# Copyright (C) 2022 The Fake Slim Shady
#
# SPDX-License-Identifier: MIT

# Auto generated script by SmartDisplayPi. Do not edit, and certainly do not share
source env/bin/activate
python3 porcupine_demo_mic.py --access_key "[SMARTDISPLAYPI_PORCUPINE_ACCESS_KEY]" --keyword_paths "./Hey-Google_en_raspberry-pi_v2_1_0.ppn"
