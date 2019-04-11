# Basic Terraform Example for Safeguards

Initialize Terraform

```
terraform init
```


Generate a JSON representation of the current state

```
terraform show -json
```

Generate a binary representation of the state and save it to `terraform.tfplan`

```
terraform plan -out terraform.tfplan > state.json
```


Generate a JSON representation of the plan

```
terraform show -json terraform.tfplan > plan.json
```