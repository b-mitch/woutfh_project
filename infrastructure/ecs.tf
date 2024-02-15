# Define ECS Task Definition
resource "aws_ecs_task_definition" "test-def" {
    family                   = "webserver-def"
    container_definitions   = jsonencode([
    {
        name            = "webserver"
        image           = "048374329844.dkr.ecr.us-east-1.amazonaws.com/woutfh-frontend:7164717"
        cpu             = 256
        memory          = 512
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
            "awslogs-group" = "webserver-logs"
            "awslogs-region" = "us-east-1"
            "awslogs-stream-prefix" = "webserver"
        }
        }
    }
    ])
    task_role_arn = "arn:aws:iam::048374329844:role/ecsTaskExecutionRole"
    execution_role_arn = "arn:aws:iam::048374329844:role/ecsTaskExecutionRole"
    network_mode = "awsvpc"
    requires_compatibilities = ["FARGATE"]
    memory = "0.5GB"
    cpu = "0.25 vCPU"
}