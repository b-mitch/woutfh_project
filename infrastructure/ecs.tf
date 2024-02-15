# Define ECS Task Definition
resource "aws_ecs_task_definition" "woutfh-webserver-def" {
    family                   = "woutfh-webserver-def"
    container_definitions   = jsonencode([
    {
        name            = "woutfh-webserver"
        image           = "048374329844.dkr.ecr.us-east-1.amazonaws.com/woutfh-frontend:7164717"
        portMappings    = [
        {
            containerPort = 80
            hostPort      = 80
            protocol      = "tcp"
        }
        ]
        essential         = true
        logConfiguration = {
            logDriver = "awslogs"
            options = {
                "awslogs-group" = "woutfh-webserver-logs"
                "awslogs-region" = "us-east-1"
                "awslogs-stream-prefix" = "woutfh-webserver"
            }
        }
    }
    ])
    task_role_arn = "arn:aws:iam::048374329844:role/ecsTaskExecutionRole"
    execution_role_arn = "arn:aws:iam::048374329844:role/ecsTaskExecutionRole"
    network_mode = "awsvpc"
    requires_compatibilities = ["FARGATE"]
    cpu = 256
    memory = 512
    runtime_platform {
        operating_system_family = "LINUX"
        cpu_architecture        = "X86_64"
    }
}

# Define ECS Task Definition
resource "aws_ecs_task_definition" "woutfh-api-def" {
    family                   = "woutfh-api-def"
    container_definitions   = jsonencode([
    {
        name            = "woutfh-api"
        image           = "048374329844.dkr.ecr.us-east-1.amazonaws.com/woutfh-backend:7164717"
        portMappings    = [
        {
            containerPort = 8000
            hostPort      = 8000
            protocol      = "tcp"
        }
        ]
        essential         = true
        logConfiguration = {
            logDriver = "awslogs"
            options = {
                "awslogs-group" = "woutfh-api-logs"
                "awslogs-region" = "us-east-1"
                "awslogs-stream-prefix" = "woutfh-api"
            }
        }
    }
    ])
    task_role_arn = "arn:aws:iam::048374329844:role/ecsTaskExecutionRole"
    execution_role_arn = "arn:aws:iam::048374329844:role/ecsTaskExecutionRole"
    network_mode = "awsvpc"
    requires_compatibilities = ["FARGATE"]
    cpu = 256
    memory = 512
    runtime_platform {
        operating_system_family = "LINUX"
        cpu_architecture        = "X86_64"
    }
}

# Create ECS Cluster
resource "aws_ecs_cluster" "WoutfhCluster" {
    name = "WoutfhCluster"
}

# Create ECS Service for webserver
resource "aws_ecs_service" "woutfh_webserver" {
    name            = "woutfh-webserver"
    cluster         = aws_ecs_cluster.WoutfhCluster.id
    task_definition = aws_ecs_task_definition.woutfh-webserver-def.arn
    launch_type     = "FARGATE"
    desired_count   = 1

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
    depends_on = [aws_ecs_task_definition.woutfh-webserver-def]
}

# Create ECS Service for API
resource "aws_ecs_service" "woutfh_api" {
    name            = "woutfh-api"
    cluster         = aws_ecs_cluster.WoutfhCluster.id
    task_definition = aws_ecs_task_definition.woutfh-api-def.arn
    launch_type     = "FARGATE"
    desired_count   = 1

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
    depends_on = [aws_ecs_task_definition.woutfh-api-def]
}
