import sys
import json

def analyze_health(data_str):
    try:
        # Load NOYU data passed from the Node.js orchestrator
        data = json.loads(data_str)
        readiness = data.get('readiness', 0)
        sleep = data.get('sleepScore', 0)
        strain = data.get('strain', 0)
        
        print("\n=== NOYU Secure AI Analysis ===")
        print(f"Analyzing metrics for User: {data.get('userId')}")
        print(f"Readiness: {readiness} | Sleep: {sleep} | Strain: {strain}")
        
        # Simulated AI logic
        if readiness > 80 and sleep > 75:
            print("=> AI Recommendation: Prime condition. Safe to proceed with high-intensity training.")
        elif strain > 15:
            print("=> AI Recommendation: High strain detected. Prioritize active recovery and hydration.")
        else:
            print("=> AI Recommendation: Base training day. Maintain normal activity levels.")
            
    except Exception as e:
        print(f"Error processing data: {e}", file=sys.stderr)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        analyze_health(sys.argv[1])
    else:
        print("No data provided.", file=sys.stderr)
