import 'dotenv/config';
import fs from 'fs';
import { fetchNoyuHealthData } from './noyu-client.js';
import { Daytona } from '@daytona/sdk'; // Requires an active Daytona instance

async function main() {
    try {
        // 1. Fetch sensitive health data from NOYU
        const userId = 'usr_99824';
        const noyuData = await fetchNoyuHealthData(userId);
        
        // Escape JSON string for command line execution
        const dataString = JSON.stringify(noyuData).replace(/"/g, '\\"');

        // 2. Initialize Daytona Client
        console.log('\n[Daytona] Connecting to Daytona server...');
        const daytona = new Daytona({
            apiKey: process.env.DAYTONA_API_KEY,
            serverUrl: process.env.DAYTONA_SERVER_URL
        });

        // 3. Create a secure, ephemeral workspace (Sandbox)
        console.log('[Daytona] Spinning up secure Python workspace...');
        const workspace = await daytona.create({
            name: `noyu-analyzer-${Date.now()}`,
            image: 'python:3.10-slim'
        });

        console.log(`[Daytona] Workspace created (ID: ${workspace.id}). Uploading algorithms...`);

        // 4. Upload the Python analysis script to the workspace
        const scriptContent = fs.readFileSync('./sandbox-scripts/analyze-health.py', 'utf-8');
        await workspace.fs.writeFile('/workspace/analyze-health.py', scriptContent);

        // 5. Execute the script securely inside the Daytona environment
        console.log('[Daytona] Executing analysis...\n');
        const executionResult = await workspace.exec(`python /workspace/analyze-health.py "${dataString}"`);

        // Print the output from the sandbox
        console.log(executionResult.output);

        // 6. Tear down the workspace to ensure zero data retention
        console.log('\n[Daytona] Destroying ephemeral workspace...');
        await daytona.remove(workspace.id);
        
        console.log('[System] Process complete. Environment cleaned up.');

    } catch (error) {
        console.error('An error occurred during orchestration:', error.message);
    }
}

main();
