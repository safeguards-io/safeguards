terraform init
terraform plan -out plan.tfplan
terraform show -json plan.tfplan > ../terraform-aws-ec2.json
rm plan.tfplan