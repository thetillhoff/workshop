# Lab 2: Application Load Balancer Integration

## Overview

In this lab, you'll learn how to add an Application Load Balancer (ALB) to distribute traffic across your ECS tasks. We'll build upon the ECS infrastructure created in Lab 1.

## Key Concepts

### Application Load Balancer

ALB helps to provide scale, performance, and resiliency for web applications deployed on the cloud.

Traditional load balancers operate at the transport layer of OSI Layer 4. Because traffic is routed to a destination IP address and port, traditional network load balancers are limited to TCP/IP traffic. They do not support granular application-level traffic control.  
Application Load Balancer, however, distributes application traffic to many servers behind it using application-level logic configured by the operator (OSI layer 7). It uses content-based routing with additional attributes of an HTTP and HTTPS request. And, it can manage more complex routing decisions and provide greater efficiency to handle application traffic at scale.

- **Load Balancing**: Distributes incoming traffic across multiple targets
- **Target Groups**: Groups of resources that receive traffic from the load balancer
- **Health Checks**: Monitors the health of registered targets
- **Listeners**: Check for connection requests from clients
- **Rules**: Determine how traffic is routed to targets

#### Benefits

<details>
  <summary style="font-weight: bold">Content-based routing</summary>
  Application Load Balancer examines the HTTP headers and routes the HTTP requests to different target groups based on values in the HTTP headers. As Application Load Balancer has visibility into HTTP headers, it can route traffic to the correct service based on the content of the URL. 

  One scenario is routing requests for different conditions to different target groups. For example, it can route traffic based on the incoming URL. If the incoming URL includes “/img,” Application Load Balancer routes traffic to a specific set of servers configured for images, as in the target group. If the URL includes “/video,” it can route that traffic to a different target group that's configured for videos. Therefore, you can construct an application with multiple microservices that can run and scale independently.
</details>
<details>
  <summary style="font-weight: bold">Redirection</summary>
  Application Load Balancer uses listener rules to redirect HTTP requests to HTTPS. The largest demand for many web applications is to support HTTP-to-HTTPS redirection, to ensure all communication between an application and its users is encrypted. Before the launch of the redirection feature, users had to depend on the server application configuration to handle redirection. This feature provides redirect action on the listener rules to redirect client requests from one URL to another. You can configure redirect either as temporary (HTTP 302) or permanent (HTTP 301).
</details>
<details>
  <summary style="font-weight: bold">Transport layer security (TLS) termination</summary>
  TLS offloading is the process of removing the SSL-based encryption from incoming traffic to relieve a web server of the processing burden of decrypting or encrypting traffic sent via SSL. TLS is a memory-intensive process. Application Load Balancer can do most of the heavy lifting by supporting TLS offloading at the load balancer itself. Therefore, you do not have to install and configure the certificate on the web servers. This feature allows web servers to be unburdened from costly encryption and decryption overhead. 

  Sometimes, unencrypted communication to the servers isn't an acceptable option. This can be because of security or compliance requirements, or that the application only accepts a secure connection. For these applications, Application Load Balancer supports end-to-end SSL/TLS encryption. Server certificates can be managed using AWS Certificate Manager (ACM) or AWS Identity and Access Management (IAM).
</details>
<details>
  <summary style="font-weight: bold">Server name indication (SNI)</summary>
  SNI is automatically activated when you associate more than one TLS certificate with the same secure listener on an Application Load Balancer. It uses a smart certificate selection algorithm with support for SNI. If the hostname provided by a client matches a single certificate in the certificate list, Application Load Balancer selects this certificate. If a hostname provided by a client matches multiple certificates in the certificate list, Application Load Balancer selects the best certificate that the client can support.
</details>
<details>
  <summary style="font-weight: bold">Sticky sessions</summary>
  Based on the Application Load Balancer managed cookies, the load balancer can direct subsequent traffic from a user session to the same server for processing. Application Load Balancer, by default, routes each request independently to a registered target based on the configured load-balancing algorithm. The cookie-based sticky session feature is useful when you want to keep a user session on the same server. To use sticky sessions, the client must support cookies.
</details>

## Architecture

We'll extend our Lab 1 architecture by adding:
1. Application Load Balancer in public subnets
2. Target Group for ECS tasks
3. Security groups for ALB
4. Updated ECS service with load balancer integration

![ALB Integration Architecture](../../media/lab_2_arch.drawio.svg)
