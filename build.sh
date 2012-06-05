#!/bin/bash -e

sencha app build production

echo "building deploy.tgz"
tar cfzv build/deploy.tgz .htaccess -C build/production .
echo "Done."
