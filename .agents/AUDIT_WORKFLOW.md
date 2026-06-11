# AI Audit Workflow

## Pass 1: Architecture Discovery

Goal: Build a complete understanding of the application.

Tasks:

* Map frontend architecture
* Map backend architecture
* Identify authentication and authorization flows
* Document API routes
* Document database models and relationships
* Identify external services and integrations
* Trace request lifecycle

Output:

* Architecture summary
* Critical business flows
* Security boundaries
* Areas requiring deeper investigation

Do NOT recommend fixes during this phase.

---

## Pass 2: Security Audit

Using the architecture map:

Review:

* Authentication
* Authorization
* Session management
* JWT/OAuth implementation
* Input validation
* SQL/NoSQL injection risks
* XSS vulnerabilities
* CSRF protection
* SSRF risks
* Secrets management
* File uploads
* Dependency vulnerabilities

For each finding:

* Severity
* Location
* Impact
* Remediation

---

## Pass 3: Performance Audit

Review:

* Database query efficiency
* N+1 query problems
* Frontend rendering performance
* Bundle size
* Caching opportunities
* Memory leaks
* API latency risks

Provide:

* Bottlenecks
* Estimated impact
* Recommended optimizations

---

## Pass 4: Code Quality Audit

Review:

* Maintainability
* Complexity
* Dead code
* Duplicate code
* Error handling
* Type safety
* Testing gaps

Rank findings by priority.

---

## Pass 5: Remediation Plan

Create:

* Top 10 critical fixes
* Top 10 quick wins
* Refactoring roadmap

For Critical and High findings:

* Provide code patches
* Explain tradeoffs
* Estimate implementation effort

---

## Final Report

Produce:

# Executive Summary

* Security Score (1-10)
* Maintainability Score (1-10)
* Performance Score (1-10)
* Overall Risk Level

# Critical Findings

# High Findings

# Medium Findings

# Low Findings

# Recommended Next Steps
