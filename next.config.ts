import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	experimental: {
		staleTimes: {
			dynamic: 30
		}
	},
	serverExternalPackages: ['@node-rs/argon2'],
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'utfs.io',
				pathname: `/a/${process.env.UPLOADTHING_TOKEN}`
			}
		]
	}
}

export default nextConfig
