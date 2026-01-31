# Terraform setup (EC2 + SG)

This folder provisions a single EC2 instance in the default VPC with security group rules for SSH, backend (8081), and frontend (3000). It also installs Docker via user data.

## Files
- `provider.tf` – provider config and S3 backend placeholders (edit before init)
- `variables.tf` – input variables
- `main.tf` – data sources, security group, key pair, EC2 instance
- `user_data.sh` – installs Docker on the instance
- `outputs.tf` – useful outputs (IP, SG, key name)
- `terraform.tfvars.example` – sample values; copy to `terraform.tfvars`

## How to use
1) (Optional but recommended) Configure remote state (S3 + DynamoDB) for team/CI usage.
   - This repo defaults to local state to work out-of-the-box in CI.
   - If you want remote state, add an `s3` backend block in `provider.tf` with your real bucket/table.
2) Copy `terraform.tfvars.example` to `terraform.tfvars` and fill values, especially `ssh_public_key` and `key_pair_name`.
3) Run in this folder:
   - `terraform init`
   - `terraform fmt` and `terraform validate`
   - `terraform plan -out=tfplan`
   - `terraform apply tfplan`
4) Use the `instance_public_ip` output for SSH and for your deploy script target. Security group already opens 8081 and 3000.

## Jenkins integration
- The pipeline can run Terraform in `terraform/`, then reads `output "instance_public_ip"` and uses it as the deploy target.
- In Jenkins job parameters, set `SSH_PUBLIC_KEY` (public key material) and `KEY_PAIR_NAME`.
- The same key pair must match the private key stored in Jenkins credentials (used for SSH during deploy).

## Notes
- Uses the default VPC and first subnet. Adjust if you need dedicated networking.
- User data only installs Docker; your Jenkins stage should still run the deployment script (e.g., `deploy.sh`) against the instance.
- Keep the private key secure; only the public key goes into `ssh_public_key`.
