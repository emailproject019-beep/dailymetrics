# NOYU + Daytona Integration Prototype

This repository orchestrates a connection between **NOYU** health data and **Daytona** secure sandboxes.

## How it Works
1. Fetches health metrics (Readiness, Sleep, Strain) from the NOYU API.
2. Initializes an ephemeral workspace using Daytona.
3. Injects a secure Python AI analysis script into the Daytona workspace.
4. Processes the sensitive health data inside the isolated container.
5. Returns the AI recommendations and automatically destroys the workspace.

## Setup
1. Run `npm install`
2. Copy `.env.example` to `.env` and fill in your Daytona API credentials.
3. Run `npm start` to execute the pipeline.
