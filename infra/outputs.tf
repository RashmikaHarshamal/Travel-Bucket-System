output "instance_public_ip" {
  description = "Public IP of the EC2 instance"
  value       = aws_instance.app.public_ip
}

output "security_group_id" {
  description = "Security group handling app and SSH access"
  value       = aws_security_group.app.id
}

output "key_pair_name" {
  description = "Key pair name used for SSH"
  value       = aws_key_pair.deployer.key_name
}
