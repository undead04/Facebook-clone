AWS
set up bucket S3
set up IAM policy
set up IAM user
create key for user
set up cloundfont
// create private_key
openssl genrsa -out private_key.pem 2048
// create public_key
openssl rsa -pubout -in private_key.pem -out public_ke
y.pem
set up key group cho cloud 
set up ec2
create instance ec2 note create key pair
// di chuyen key vao ssh
move server-facebook-clone-key-pair.pem C:\Users\Admin\.ssh
chmod 400 ~/.ssh/server-facebook-clone-key-pair.pem
ssh -i "~/.ssh/server-facebook-clone-key-pair.pem" ubuntu@ec2-13-250-39-200.ap-southeast-1.compute.amazonaws.com


sudo apt-get update
sudo apt-get install -y nginx
sudo apt-get install nginx
//check status
sudo systemctl status nginx
// run host
curl localhost

// set up mysql dung amazonaws
sudo amazon-linux-extras install epel -y
sudo yum install https://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm
sudo yum install mysql-community-server -y
sudo systemctl start mysqld
sudo systemctl enable mysqld
sudo systemctl status mysqld
cat /var/lo
sudo cat /var/log/mysqld.log | grep "temporary password"
mysql -uroot -p
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
exit
show database
// install database localhost upload ec2
//1. connection with ec2
//2. source mysqlsampledatabase.sql
//3. show database
//4. use shopDEV
//5. show tables
// trao quyen cho user
GRANT ALL PRIVILEGES ON shopDEV.* TO "tipjs'@'localhost"
//
GRANT ALL PRIVILEGES ON *.* TO `anotystck`
// switch  office change online on github
sudo ./svc.sh install
sudo ./svc.sh start
// config nginx
cd /etc/nginx/sites-available
sudo vin default
esc -y
// reaload nginx
sudo systemctl restart nginx