#!/bin/bash

mkdir -p ./build/backend/; mv ./backend/build/* ./build/backend/;
mkdir -p ./build/frontend/; mv ./frontend/build/* ./build/frontend/;
cp package.json package-lock.json ./build;
