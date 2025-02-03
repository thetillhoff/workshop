# Theory

In this lab, we'll learn how to implement a cache for our application.


## Caching

A cache is a temporary storage layer that sits between an application and its data source (like a database). It stores frequently accessed data in fast memory to reduce load on the backend systems and improve response times.

While applications commonly implement local in-memory caching within each instance, this approach becomes problematic in distributed systems where multiple application instances need to maintain consistent cached data. When running multiple instances of an application, an external shared cache (like Redis) ensures all instances work with the same cached data.

Key characteristics of caches:
- Data is stored in memory for fast retrieval
- Cache entries typically have a time-to-live (TTL) after which they expire
- Cache misses result in fetching from the original data source
- Cache hits avoid expensive backend operations

Common caching patterns:
- Read-through: Application checks cache first, falls back to database
- Write-through: Updates are written to both cache and database
- Write-behind: Updates go to cache first, are asynchronously written to database
- Cache-aside: Application manages cache population separately

For distributed systems, shared caches like Redis allow multiple application instances to access the same cached data, maintaining consistency across the system and avoiding the problems of inconsistent local caches or cache hits on one instance but not the others.


## Level 1 and Level 2 Constructs in CDK

AWS CDK constructs come in different abstraction levels. Level 1 (L1) constructs, identifiable by their "Cfn" prefix, are direct one-to-one mappings to CloudFormation resources and require detailed configuration. Level 2 (L2) constructs build on top of these, providing higher-level abstractions that implement AWS best practices by default while hiding much of the underlying complexity.
So far, we've only used L2 constructs.
ElastiCache has an L1 construct, which means a bit more code is required to set it up.
