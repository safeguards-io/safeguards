terraform init
terraform plan -out plan.tfplan
terraform show -json plan.tfplan > state.json
rm plan.tfplan