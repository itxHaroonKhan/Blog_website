/**
 * This configuration file lets you run `$ sanity [command]` in this folder
 * Go to https://www.sanity.io/docs/cli to learn more.
 */
import { defineCliConfig } from 'sanity/cli'

// Retrieve environment variables, or set defaults to avoid errors
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'default_project_id';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'default_dataset';

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.warn('Warning: NEXT_PUBLIC_SANITY_PROJECT_ID is not set. Using default value.');
}

if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
  console.warn('Warning: NEXT_PUBLIC_SANITY_DATASET is not set. Using default value.');
}

export default defineCliConfig({
  api: {
    projectId,
    dataset
  }
});