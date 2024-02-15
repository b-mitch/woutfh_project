# create production database subnet group
# terraform aws create database subnet group
resource "aws_db_subnet_group" "ecs_data_subnet_group" {
    name       = "ecs-data-subnet-group"
    subnet_ids = [aws_subnet.ecs_data_subnet_az1.id, aws_subnet.ecs_data_subnet_az2.id]
    tags = {
        Name = "ecs-data-subnet-group"
    }
}

# create RDS instance for production
# terraform aws create rds instance
resource "aws_db_instance" "ecs_db" {
    engine            = "postgres"
    instance_class    = "db.t3.micro"
    identifier        = "ecs-db-instance"
    allocated_storage = 20
    db_name           = "ecs_db"
    username          = var.db_username
    password          = var.db_password
    engine_version    = "15.4"
    db_subnet_group_name = aws_db_subnet_group.ecs_data_subnet_group.name
    vpc_security_group_ids = [aws_security_group.database_security_group.id]
    skip_final_snapshot = true

    tags = {
        Name = "ecs-db-instance"
    }
}
