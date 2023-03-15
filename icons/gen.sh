set -e
icon-gen -i ./icons/app.svg -o ./icons/ --icns --icns-name app --icns-sizes 16,32,64,128,256,512,1024
icon-gen -i ./icons/app.svg -o ./icons/ --ico --ico-name app --ico-sizes 16,32,48,64,128,256
icon-gen -i ./icons/app.svg -o ./icons/ --favicon --favicon-name app