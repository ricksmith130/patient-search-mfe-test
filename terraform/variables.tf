variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "patient-search-mfe"
}

variable "environment" {
  description = "Deployment environment (e.g. dev, prod)"
  type        = string
  default     = "dev"
}

variable "region" {
  description = "AWS Region"
  type        = string
  default     = "eu-west-2"
}
