# Define CodeDeploy Application
resource "aws_codedeploy_app" "woutfh" {
    compute_platform = "ECS"
    name = "woutfh"
}

# Define CodeDeploy Deployment Group for Webserver ECS Service
resource "aws_codedeploy_deployment_group" "webserver_deployment_group" {
    app_name              = aws_codedeploy_app.woutfh.name
    deployment_group_name = "webserver-deployment-group"
    service_role_arn      = "arn:aws:iam::048374329844:role/AWSCodeDeployRoleForECS"
    deployment_config_name      = "CodeDeployDefault.ECSAllAtOnce"

    blue_green_deployment_config {
        deployment_ready_option {
            action_on_timeout = "CONTINUE_DEPLOYMENT"
        }

        terminate_blue_instances_on_deployment_success {
            action                           = "TERMINATE"
            termination_wait_time_in_minutes = 10
        }
    }

    deployment_style {
        deployment_option = "WITH_TRAFFIC_CONTROL"
        deployment_type   = "BLUE_GREEN"
    }

    ecs_service {
        cluster_name = aws_ecs_cluster.WoutfhCluster.name
        service_name = aws_ecs_service.woutfh_webserver.name
    }

    load_balancer_info {
        target_group_pair_info {
            prod_traffic_route {
                listener_arns = [aws_lb_listener.webserver_listener.arn]
            }

            target_group {
                name = aws_lb_target_group.web_blue.name
            }

            target_group {
                name = aws_lb_target_group.web_green.name
            }
        }
    }
}

# Define CodeDeploy Deployment Group for API ECS Service\
resource "aws_codedeploy_deployment_group" "api_deployment_group" {
    app_name              = aws_codedeploy_app.woutfh.name
    deployment_group_name = "api-deployment-group"
    service_role_arn      = "arn:aws:iam::048374329844:role/AWSCodeDeployRoleForECS"
    deployment_config_name      = "CodeDeployDefault.ECSAllAtOnce"

    blue_green_deployment_config {
        deployment_ready_option {
            action_on_timeout = "CONTINUE_DEPLOYMENT"
        }

        terminate_blue_instances_on_deployment_success {
            action                           = "TERMINATE"
            termination_wait_time_in_minutes = 10
        }
    }

    deployment_style {
        deployment_option = "WITH_TRAFFIC_CONTROL"
        deployment_type   = "BLUE_GREEN"
    }

    ecs_service {
        cluster_name = aws_ecs_cluster.WoutfhCluster.name
        service_name = aws_ecs_service.woutfh_api.name
    }

    load_balancer_info {
        target_group_pair_info {
            prod_traffic_route {
                listener_arns = [aws_lb_listener.api_listener.arn]
            }

            target_group {
                name = aws_lb_target_group.api_blue.name
            }

            target_group {
                name = aws_lb_target_group.api_green.name
            }
        }
    }
}
