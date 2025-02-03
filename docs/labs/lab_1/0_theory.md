# Theory

In this lab, we will learn how to create a VPC and subnets using AWS CDK.


## Networking at AWS

Amazon Web Services (AWS) organizes its global cloud infrastructure into Regions, which are separate geographic areas containing multiple isolated data centers called Availability Zones (AZs).
Within a Region, you can create Virtual Private Clouds (VPCs) which act as isolated virtual networks where you deploy your AWS resources.
Each VPC can span multiple AZs in a Region and is divided into subnets, which are segments of the VPC's IP address range located in specific AZs.
Subnets allow you to organize and isolate resources within your VPC, with public subnets having direct internet access and private subnets being isolated from the internet.
The private subnet can be compared to your network at home, with IP addresses in the range of 192.168.0.0/24 or something similar.
Resources in a public subnet can have two IP addresses; One private IP address and one public IP address, that's reachable from the internet.

<!-- TODO add diagram -->

This multi-layered network architecture enables high availability, fault tolerance, and secure deployment of applications across AWS infrastructure.

There are two types of gateways that are relevant for this workshop:
- An Internet Gateway enables two-way internet access for resources in public subnets.
- A NAT Gateway allows resources in private subnets to access the internet while remaining private themselves, just like your router at home.

## Security Groups

Security groups are a fundamental concept in AWS networking. They act as virtual firewalls for your resources, controlling inbound and outbound traffic. They are relevant for almost all resources in AWS. Without them, your services could be open to the entire internet, or might not be able to reach the internet themselves. Or they might not be able to reach each other.
