variable "blue_weight" {
  description = "blue group priority weight"
  type        = string
  default     = 100
}

variable "green_weight" {
  description = "green group priority weight"
  type        = string
  default     = 0
}

variable "aws_access_key" {
  description = "AWS access key"
  type        = string
}

variable "aws_secret_key" {
  description = "AWS secret key"
  type        = string
}
