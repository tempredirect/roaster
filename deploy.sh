#!/bin/bash -e

scp -i ~/.ssh/ec2d.pem build/deploy.tgz ubuntu@ec2d.logicalpractice.com:

ssh -i ~/.ssh/ec2d.pem ubuntu@ec2d.logicalpractice.com "sudo rm -rf /var/www/roaster/*; cd /var/www/roaster && sudo tar xfvz /home/ubuntu/deploy.tgz ."
