# Define webserver log group
resource "aws_cloudwatch_log_group" "woutfh_webserver_logs" {
  name              = "/ecs/woutfh-webserver-def" 
  retention_in_days = 7 
}

# Define api log group
resource "aws_cloudwatch_log_group" "woutfh_api_logs" {
  name              = "/ecs/woutfh-api-def" 
  retention_in_days = 7 
}

# Define ECS Task Definition
resource "aws_ecs_task_definition" "woutfh_webserver_def" {
    family                   = "woutfh-webserver-def"
    task_role_arn            = "arn:aws:iam::048374329844:role/ecsTaskExecutionRole"
    execution_role_arn       = "arn:aws:iam::048374329844:role/ecsTaskExecutionRole"
    network_mode             = "awsvpc"
    cpu                      = "1024"
    memory                   = "3072"
    requires_compatibilities = ["FARGATE"]

    container_definitions = jsonencode([
        {
            name      = "woutfh-webserver"
            image     = "048374329844.dkr.ecr.us-east-1.amazonaws.com/woutfh-frontend:7164717"
            cpu       = 0
            essential = true
            portMappings = [
                {
                    name          = "webserver-80"
                    containerPort = 80
                    hostPort      = 80
                    protocol      = "tcp"
                    appProtocol   = "http"
                }
            ]
            logConfiguration = {
                logDriver = "awslogs"
                options = {
                    "awslogs-create-group"    = "true"
                    "awslogs-group"           = "/ecs/woutfh-webserver-def"
                    "awslogs-region"          = "us-east-1"
                    "awslogs-stream-prefix"   = "ecs"
                }
            }
        }
    ])
    runtime_platform {
        cpu_architecture         = "X86_64"
        operating_system_family  = "LINUX"
    }
}

# Define ECS Task Definition
resource "aws_ecs_task_definition" "woutfh_api_def" {
    family                   = "woutfh-api-def"
    task_role_arn            = "arn:aws:iam::048374329844:role/ecsTaskExecutionRole"
    execution_role_arn       = "arn:aws:iam::048374329844:role/ecsTaskExecutionRole"
    network_mode             = "awsvpc"
    cpu                      = "1024"
    memory                   = "3072"
    requires_compatibilities = ["FARGATE"]

    container_definitions = jsonencode([
        {
            name      = "woutfh-api"
            image     = "048374329844.dkr.ecr.us-east-1.amazonaws.com/woutfh-backend:7164717"
            cpu       = 0
            essential = true
            portMappings = [
                {
                    name          = "api-8000"
                    containerPort = 8000
                    hostPort      = 8000
                    protocol      = "tcp"
                    appProtocol   = "http"
                }
            ]
            logConfiguration = {
                logDriver = "awslogs"
                options = {
                    "awslogs-create-group"    = "true"
                    "awslogs-group"           = "/ecs/woutfh-api-def"
                    "awslogs-region"          = "us-east-1"
                    "awslogs-stream-prefix"   = "ecs"
                }
            }
        }
    ])
    runtime_platform {
        cpu_architecture         = "X86_64"
        operating_system_family  = "LINUX"
    }
}

# Create ECS Cluster
resource "aws_ecs_cluster" "WoutfhCluster" {
    name = "WoutfhCluster"
}

# Create ECS Service for webserver
resource "aws_ecs_service" "woutfh_webserver" {
    name                               = "woutfh-webserver"
    enable_ecs_managed_tags            = true 
    health_check_grace_period_seconds  = 2 
    cluster                            = aws_ecs_cluster.WoutfhCluster.id
    task_definition                    = aws_ecs_task_definition.woutfh_webserver_def.arn
    launch_type                        = "FARGATE"
    desired_count                      = 1

    deployment_controller {
        type = "CODE_DEPLOY"
    }

    load_balancer {
        target_group_arn = aws_lb_target_group.web_blue.arn # Starting with blue
        container_name   = "woutfh-webserver"
        container_port   = 80
    }

    network_configuration {
        subnets = [aws_subnet.ecs_subnet_az1.id, aws_subnet.ecs_subnet_az2.id]
        security_groups = [aws_security_group.webserver_alb_security_group.id]
    }
    depends_on = [aws_ecs_task_definition.woutfh_webserver_def]
}

# Create ECS Service for API
resource "aws_ecs_service" "woutfh_api" {
    name                               = "woutfh-api"
    enable_ecs_managed_tags            = true 
    health_check_grace_period_seconds  = 2 
    cluster                            = aws_ecs_cluster.WoutfhCluster.id
    task_definition                    = aws_ecs_task_definition.woutfh_api_def.arn
    launch_type                        = "FARGATE"
    desired_count                      = 1

    deployment_controller {
        type = "CODE_DEPLOY"
    }

    load_balancer {
        target_group_arn = aws_lb_target_group.api_blue.arn # Starting with blue
        container_name   = "woutfh-api"
        container_port   = 8000
    }

    network_configuration {
        subnets = [aws_subnet.ecs_subnet_az1.id, aws_subnet.ecs_subnet_az2.id]
        security_groups = [aws_security_group.api_alb_security_group.id]
    }
    depends_on = [aws_ecs_task_definition.woutfh_api_def]
}
