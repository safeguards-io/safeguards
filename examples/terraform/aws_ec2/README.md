# Basic Terraform Example for Safeguards

Initialize Terraform

```
terraform init
```

Generate a state by applying the 
```
terraform apply --auto-approve
```

Modify the content of `main.tf` so that there are operations in the plan.

Generate a binary representation of the state and save it to `terraform.tfplan`

```
terraform plan -out terraform.tfplan
```

Generate a JSON representation of the plan

```
terraform show -json terraform.tfplan > plan.json
```