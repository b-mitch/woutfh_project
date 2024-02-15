# create webserver application load balancer
# terraform aws create application load balancer
resource "aws_lb" "webserver_alb" {
    name               = "webserver-alb"
    internal           = false
    load_balancer_type = "application"
    security_groups    = [aws_security_group.webserver_alb_security_group.id]
    subnets            = [aws_subnet.ecs_subnet_az1.id, aws_subnet.ecs_subnet_az2.id]
    enable_deletion_protection = false

    tags = {
        Name = "webserver-alb"
    }
}

# create blue webserver target group
# terraform aws create target group
resource "aws_lb_target_group" "web_blue" {
    name        = "web-blue"
    target_type = "ip"
    port        = 80
    protocol    = "HTTP"
    vpc_id      = aws_vpc.ecs_vpc.id

    health_check {
        healthy_threshold   = 2
        interval            = 30
        matcher             = "200,301,302"
        path = "/"
        port = "traffic-port"
        protocol            = "HTTP"
        timeout             = 5
        unhealthy_threshold = 2
    }

    tags = {
        Name = "web-blue"
    }
}
# create green webserver target group
# terraform aws create target group
resource "aws_lb_target_group" "web_green" {
    name        = "web-green"
    target_type = "ip"
    port        = 80
    protocol    = "HTTP"
    vpc_id      = aws_vpc.ecs_vpc.id

    health_check {
        healthy_threshold   = 2
        interval            = 30
        matcher             = "200,301,302"
        path = "/"
        port = "traffic-port"
        protocol            = "HTTP"
        timeout             = 5
        unhealthy_threshold = 2
    }

    tags = {
        Name = "web-green"
    }
}

# create listener for the webserver application load balancer
# terraform aws create listener
resource "aws_lb_listener" "webserver_listener" {
    load_balancer_arn = aws_lb.webserver_alb.arn
    port              = "80"
    protocol          = "HTTP"

    default_action {
      type             = "forward"
      forward {
        target_group {
          arn    = aws_lb_target_group.web_blue.arn
          weight = 100
        }

        target_group {
          arn    = aws_lb_target_group.web_green.arn
          weight = 0
        }

        stickiness {
          enabled  = false
          duration = 1
        }
      }
    }
}

# create api application load balancer
# terraform aws create application load balancer
resource "aws_lb" "api_alb" {
    name               = "api-alb"
    internal           = false
    load_balancer_type = "application"
    security_groups    = [aws_security_group.api_alb_security_group.id]
    subnets            = [aws_subnet.ecs_subnet_az1.id, aws_subnet.ecs_subnet_az2.id]
    enable_deletion_protection = false

    tags = {
        Name = "api-alb"
    }
}

# create blue api target group
# terraform aws create target group
resource "aws_lb_target_group" "api_blue" {
    name        = "api-blue"
    target_type = "ip"
    port        = 8000
    protocol    = "HTTP"
    vpc_id      = aws_vpc.ecs_vpc.id

    health_check {
        healthy_threshold   = 2
        interval            = 30
        matcher             = "200,301,302"
        path = "/"
        port = "traffic-port"
        protocol            = "HTTP"
        timeout             = 5
        unhealthy_threshold = 2
    }

    tags = {
        Name = "api-blue"
    }
}

# create green api target group
# terraform aws create target group
resource "aws_lb_target_group" "api_green" {
    name        = "api-green"
    target_type = "ip"
    port        = 8000
    protocol    = "HTTP"
    vpc_id      = aws_vpc.ecs_vpc.id

    health_check {
        healthy_threshold   = 2
        interval            = 30
        matcher             = "200,301,302"
        path = "/"
        port = "traffic-port"
        protocol            = "HTTP"
        timeout             = 5
        unhealthy_threshold = 2
    }

    tags = {
        Name = "api-green"
    }
}

# create listener for the api application load balancer
# terraform aws create listener
resource "aws_lb_listener" "api_listener" {
    load_balancer_arn = aws_lb.api_alb.arn
    port              = "8000"
    protocol          = "HTTP"

    default_action {
      type             = "forward"
      forward {
        target_group {
          arn    = aws_lb_target_group.api_blue.arn
          weight = 100
        }

        target_group {
          arn    = aws_lb_target_group.api_green.arn
          weight = 0
        }

        stickiness {
          enabled  = false
          duration = 1
        }
      }
    }
}
