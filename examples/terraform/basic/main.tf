variable "name" {
  default = "candice"
}

resource "random_id" "random" {
  byte_length = 8
}

output "random" {
  value = "${random_id.random.hex}"
}

output "hello_world" {
  value = "Hello, ${var.name}"
}