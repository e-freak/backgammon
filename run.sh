#!/bin/bash


npm run compile
electron .

#sudo npm -g install electron-packager
#see https://github.com/electron/electron/releases
#electron-packager ./ sample --platform=darwin --arch=x64 --electronVersion=1.7.10