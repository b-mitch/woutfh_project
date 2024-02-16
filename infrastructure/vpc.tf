# create vpc
# terraform aws create vpc
resource "aws_vpc" "ecs_vpc" {
  cidr_block              = "192.168.0.0/24"
  instance_tenancy        = "default"
  enable_dns_hostnames    = true

  tags      = {
    Name    = "ecs-vpc"
  }
}

# create internet gateway and attach it to vpc
# terraform aws create internet gateway
resource "aws_internet_gateway" "ecs_internet_gateway" {
  vpc_id    = aws_vpc.ecs_vpc.id 

  tags      = {
    Name    = "ecs-internet-gateway"
  }
}

# create public production subnet az1
# terraform aws create subnet
resource "aws_subnet" "ecs_subnet_az1" {
  vpc_id                  = aws_vpc.ecs_vpc.id
  cidr_block              = "192.168.0.0/28"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags      = {
    Name    = "ecs-subnet-az1"
  }
}

# create public production subnet az2
# terraform aws create subnet
resource "aws_subnet" "ecs_subnet_az2" {
  vpc_id                  = aws_vpc.ecs_vpc.id
  cidr_block              = "192.168.0.16/28"
  availability_zone       = "us-east-1b"
  map_public_ip_on_launch = true

  tags      = {
    Name    = "ecs-subnet-az2"
  }
}

# create route table and add public route
# terraform aws create route table
resource "aws_route_table" "ecs_route_table" {
  vpc_id       = aws_vpc.ecs_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.ecs_internet_gateway.id
  }

  tags       = {
    Name     = "ecs-route-table"
  }
}

# associate public production subnet az1 to "public route table"
# terraform aws associate subnet with route table
resource "aws_route_table_association" "ecs_subnet_az1_route_table_association" {
  subnet_id           = aws_subnet.ecs_subnet_az1.id
  route_table_id      = aws_route_table.ecs_route_table.id
}

# associate public production subnet az2 to "public route table"
# terraform aws associate subnet with route table
resource "aws_route_table_association" "ecs_subnet_az2_route_table_association" {
  subnet_id           = aws_subnet.ecs_subnet_az2.id
  route_table_id      = aws_route_table.ecs_route_table.id
}

# create private production data subnet az1
# terraform aws create subnet
resource "aws_subnet" "ecs_data_subnet_az1" {
  vpc_id                   = aws_vpc.ecs_vpc.id
  cidr_block               = "192.168.0.32/28"
  availability_zone        = "us-east-1a"
  map_public_ip_on_launch  = false

  tags      = {
    Name    = "ecs-data-subnet-az1"
  }
}

# create private production data subnet az2
# terraform aws create subnet
resource "aws_subnet" "ecs_data_subnet_az2" {
  vpc_id                   = aws_vpc.ecs_vpc.id
  cidr_block               = "192.168.0.48/28"
  availability_zone        = "us-east-1b"
  map_public_ip_on_launch  = false

  tags      = {
    Name    = "ecs-data-subnet-az2"
  }
}
