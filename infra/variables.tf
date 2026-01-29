variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t3.micro"
}

variable "key_pair_name" {
  description = "Name for the EC2 key pair"
  type        = string
}

variable "ssh_public_key" {
  description = "Public key material for SSH access"
  type        = string
  sensitive   = true
}

variable "docker_user" {
  description = "Docker Hub username for pulling images"
  type        = string
  default     = "rashmikaharshamal"
}

variable "allowed_ssh_cidr" {
  description = "CIDR allowed to SSH into the instance"
  type        = string
  default     = "0.0.0.0/0"
}

variable "allowed_http_cidr" {
  description = "CIDR allowed to reach app ports (8081 backend, 3000 frontend)"
  type        = string
  default     = "0.0.0.0/0"
}
