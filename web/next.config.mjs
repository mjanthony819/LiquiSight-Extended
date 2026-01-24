import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Load repo-root .env so this project can share a single env file.
// (Next.js normally loads env files from the web/ directory.)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '..', '.env') })

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
