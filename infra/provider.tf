terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Replace bucket/key/table with your real state store before running init.
  backend "s3" {
    bucket         = "REPLACE_ME_TF_STATE_BUCKET"
    key            = "travel-bucket/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "REPLACE_ME_TF_LOCK_TABLE"
    encrypt        = true
  }
}

provider "aws" {
  region = var.aws_region
}
