# Ideas For Improvements

- find a way to verify caching locally and in aws works
  then clean up security groups / connections in ecs-stack

- structured logging

- S3 / SNS

- dockerfile optimization with multi-stage build
- remove `?` and `!` from props where it makes sense
- cloudshell, speedtest py script -> 1.4Gbps
  cloudshell has docker preinstalled
  k6 via docker -> works, but better not advertise it, as it might be recognized as a DDoS attack by AWS
- add architecture diagram to intro/welcome/lab_0/lab_1/...
- send feedback link & reminder


## General use case adjustment

image processing - whenever there was a file uploaded, trigger the lambda.
It takes the image, resizes it / converts it, and stores it back to s3.
It also updates the entry in RDS.


## SQS

Have the lambda triggers in a queue, and invalid image types in a dlq.


## S3

Store files in s3

S3 maybe for static frontend or target for lambda output?

s3 maybe with cloudshell and database access, up to a database dump?

use case "todo, but photographed"

Add api route to upload an image to s3 (directly or via ecs task?)

add api route to list and/or retrieve an image from s3


## SNS

Next, go to the SNS console and create a topic. Make sure to enable encryption.
