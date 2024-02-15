# create security group for the application load balancer
# terraform aws create security group
resource "aws_security_group" "webserver_alb_security_group" {
    name        = "webserver-alb-security-group"
    description = "enable http/https access on port 80 and 443"
    vpc_id      = aws_vpc.ecs_vpc.id

    ingress {
        description = "http access"
        from_port   = 80
        to_port     = 80
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    ingress {
        description = "https access"
        from_port   = 443
        to_port     = 443
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
    }

    egress {
        from_port   = 0
        to_port     = 0
        protocol    = -1
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        Name = "webserver-alb-security-group"
    }
}

# create security group for the application load balancer
# terraform aws create security group
resource "aws_security_group" "api_alb_security_group" {
    name        = "api-alb-security-group"
    description = "enable access from webserver security group on port 8000"
    vpc_id      = aws_vpc.ecs_vpc.id

    ingress {
        description = "webserver access"
        from_port   = 8000
        to_port     = 8000
        protocol    = "tcp"
        security_groups = [aws_security_group.webserver_alb_security_group.id]
    }

    egress {
        from_port   = 0
        to_port     = 0
        protocol    = -1
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        Name = "api-alb-security-group"
    }
}

# Add ingress rule to webserver alb security group allowing traffic from api alb security group
# Terraform aws create security group rule
resource "aws_security_group_rule" "webserver_alb_ingress_from_api" {
    security_group_id = aws_security_group.webserver_alb_security_group.id

    type       = "ingress"
    description = "allow traffic from api alb security group"
    from_port  = 8000
    to_port    = 8000
    protocol   = "tcp"
    source_security_group_id = aws_security_group.api_alb_security_group.id

}

# create security group for the production web server in az1
# terraform aws create security group
resource "aws_security_group" "webserver_security_group_az1" {
    name        = "webserver-security-group-az1"
    description = "enable http/https access on ports 80/443"
    vpc_id      = aws_vpc.ecs_vpc.id

    ingress {
        description = "http access"
        from_port   = 80
        to_port     = 80
        protocol    = "tcp"
        security_groups = [aws_security_group.webserver_alb_security_group.id]
    }

    ingress {
        description = "https access"
        from_port   = 443
        to_port     = 443
        protocol    = "tcp"
        security_groups = [aws_security_group.webserver_alb_security_group.id]
    }

    egress {
        from_port   = 0
        to_port     = 0
        protocol    = -1
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        Name = "webserver-security-group-az1"
    }
}

# create security group for the production web server in az2
# terraform aws create security group
resource "aws_security_group" "webserver_security_group_az2" {
    name        = "webserver-security-group-az2"
    description = "enable http/https access on ports 80/443"
    vpc_id      = aws_vpc.ecs_vpc.id

    ingress {
        description = "http access"
        from_port   = 80
        to_port     = 80
        protocol    = "tcp"
        security_groups = [aws_security_group.webserver_alb_security_group.id]
    }

    ingress {
        description = "https access"
        from_port   = 443
        to_port     = 443
        protocol    = "tcp"
        security_groups = [aws_security_group.webserver_alb_security_group.id]
    }

    egress {
        from_port   = 0
        to_port     = 0
        protocol    = -1
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        Name = "webserver-security-group-az2"
    }
}

# create security group for the production api in az1
# terraform aws create security group
resource "aws_security_group" "api_security_group_az1" {
    name        = "api-security-group-az1"
    description = "enable access on port 8000 from webserver security group"
    vpc_id      = aws_vpc.ecs_vpc.id

    ingress {
        description = "webserver access"
        from_port   = 8000
        to_port     = 8000
        protocol    = "tcp"
        security_groups = [aws_security_group.api_alb_security_group.id]
    }

    egress {
        from_port   = 0
        to_port     = 0
        protocol    = -1
        cidr_blocks = ["0.0.0.0/0"]
    }
}

# create security group for the production api in az2
# terraform aws create security group
resource "aws_security_group" "api_security_group_az2" {
    name        = "api-security-group-az2"
    description = "enable access on port 8000 from webserver security group"
    vpc_id      = aws_vpc.ecs_vpc.id

    ingress {
        description = "webserver access"
        from_port   = 8000
        to_port     = 8000
        protocol    = "tcp"
        security_groups = [aws_security_group.api_alb_security_group.id]
    }

    egress {
        from_port   = 0
        to_port     = 0
        protocol    = -1
        cidr_blocks = ["0.0.0.0/0"]
    }
}

# create security group for the production database server
# terraform aws create security group
resource "aws_security_group" "database_security_group" {
    name        = "database-security-group"
    description = "enable access on port 5432 from webserver sg"
    vpc_id      = aws_vpc.ecs_vpc.id

    ingress {
        description = "postgres access"
        from_port   = 5432
        to_port     = 5432
        protocol    = "tcp"
        security_groups = [aws_security_group.api_alb_security_group.id]
    }

    egress {
        from_port   = 0
        to_port     = 0
        protocol    = -1
        cidr_blocks = ["0.0.0.0/0"]
    }

    tags = {
        Name = "database-security-group"
    }
}

# Add ingress rule to api alb security group allowing traffic from RDS security group
# Terraform aws create security group rule
resource "aws_security_group_rule" "api_alb_ingress_from_db" {
  security_group_id = aws_security_group.api_alb_security_group.id

  type        = "ingress"
  description = "allow traffic from production RDS security group"
  from_port   = 5432 
  to_port     = 5432
  protocol    = "tcp"
  source_security_group_id = aws_security_group.database_security_group.id
}
