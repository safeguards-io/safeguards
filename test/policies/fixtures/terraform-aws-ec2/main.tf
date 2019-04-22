provider "aws" {
  region = "us-west-2"
}

# data "aws_ami" "ubuntu" {
#   most_recent = true

#   filter {
#     name   = "name"
#     values = ["ubuntu/images/hvm-ssd/ubuntu-trusty-14.04-amd64-server-*"]
#   }

#   filter {
#     name   = "virtualization-type"
#     values = ["hvm"]
#   }

#   owners = ["099720109477"] # Canonical
# }

# resource "aws_instance" "web" {
#   ami           = "${data.aws_ami.ubuntu.id}"
#   instance_type = "t2.micro"

#   tags = {
#     Name = "HelloWorld"
#   }
# }

# resource "aws_instance" "web2" {
#   ami           = "${data.aws_ami.ubuntu.id}"
#   instance_type = "t2.micro"

#   tags = {
#     Name = "HelloWorld"
#   }
# }

module "instance-1" {
  source = "./instance"
  type = "t2.micro"
  name = "web1"
  availability_zone = "us-west-2a"
}

module "instance-2" {
  source = "./instance"
  type = "t2.micro"
  name = "web2"
  availability_zone = "us-west-2b"
}