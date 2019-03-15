# only deploys builds

rm build -R
npm run build

cp -R fonts build/stream-overlay/fonts
cp -R sounds build/stream-overlay/sounds

cd build
tar -zcvf build.tar.gz stream-overlay

# clean previous deployment
ssh tim@luckydye.de rm /srv/www/stream-overlay -R

# send new build zip
scp build.tar.gz tim@luckydye.de:/tmp

# unpack and clean build
ssh tim@luckydye.de tar -xvzf /tmp/build.tar.gz -C /srv/www/
ssh tim@luckydye.de rm /tmp/build.tar.gz
