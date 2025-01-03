// next.config.ts
import { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    domains: ['cdn.sanity.io'], // Allow images from Sanity's CDN
  },
}

export default config