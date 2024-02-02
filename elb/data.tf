# fetch the vpc from aws
data "aws_vpc" "vpc" {
  id = "vpc-019bf2df87c4566a9"
}

# fetch subnets from aws
data "aws_subnet" "public_prod_subnet_az1" {
  id = "subnet-01649c9cb7e2a10ef"
}

data "aws_subnet" "public_prod_subnet_az2" {
  id = "subnet-02995b1288d88a987"
}

# fetch the alb security group from aws
data "aws_security_group" "alb_security_group" {
  id = "sg-09185f43db5486267"
}

# fetch ec2 instances from aws
data "aws_instance" "prod_instance_az1" {
  instance_id = "i-08b56b87c4b59f1e6"
}

data "aws_instance" "prod_instance_az2" {
  instance_id = "i-09a2a56f2f27c9cbc"
}