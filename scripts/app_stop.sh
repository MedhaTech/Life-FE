
#!/bin/bash
echo 'Stopping apache server...'
sudo -u ec2-user systemctl stop apache2.service
