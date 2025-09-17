import { createApi } from 'unsplash-js';

// Create Unsplash API instance with environment variable
const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY 
  // Note: We don't need a secret key for public API access
});

export default unsplash;
