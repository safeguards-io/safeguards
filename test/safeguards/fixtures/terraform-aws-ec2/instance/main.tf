variable "region" {
  default = "us-east-1"
  type = string
}

variable "name" {
  type = string
}

variable "type" {
  default = "t2.micro"
  type = string
}

variable "availability_zone" {
  default = "us-west-1a"
  type = string
}

provider "aws" {
  region = "${var.region}"
}

data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-trusty-14.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_instance" "instance" {
  ami           = "${data.aws_ami.ubuntu.id}"
  instance_type = var.type
  availability_zone = var.availability_zone

  tags = {
    Name = var.name
  }
}