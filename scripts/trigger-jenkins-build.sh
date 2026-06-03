#!/bin/bash
set -e
CRUMB=$(curl -s -u admin:admin123 http://127.0.0.1:8080/crumbIssuer/api/json | grep -o '"crumb":"[^"]*"' | cut -d'"' -f4)
CODE=$(curl -s -o /tmp/build.out -w "%{http_code}" -u admin:admin123 -H "Jenkins-Crumb: $CRUMB" -X POST http://127.0.0.1:8080/job/loc8tr-ci/build)
echo "HTTP $CODE"
cat /tmp/build.out
