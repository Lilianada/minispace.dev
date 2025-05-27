#!/bin/bash
# Start the subdomain monitoring script

# Create logs directory if it doesn't exist
mkdir -p logs

# Run the monitoring script in the background
echo "Starting subdomain error monitoring..."
node scripts/monitor-subdomain-errors.js > logs/monitor.log 2>&1 &
echo $! > .monitor.pid
echo "Monitoring started with PID: $(cat .monitor.pid)"
echo "Log file: logs/monitor.log"
