import prisma from '@/lib/prisma'
import { NextRequest } from 'next/server'
import { UTApi } from 'uploadthing/server'

export async function GET(req: NextRequest) {
	try {
		const authHeader = req.headers.get('Authorization')

		if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
			return Response.json({ error: 'Нет доступа' }, { status: 401 })
		}

		const unusedMedia = await prisma.media.findMany({
			where: {
				postId: null,
				...(process.env.NODE_ENV === 'production'
					? {
							createdAt: {
								lte: new Date(Date.now() - 1000 * 60 * 60 * 24)
							}
						}
					: {})
			},
			select: {
				id: true,
				url: true
			}
		})

		new UTApi().deleteFiles(
			unusedMedia.map(media => media.url.split('f/').pop() as string)
		)

		await prisma.media.deleteMany({
			where: {
				id: {
					in: unusedMedia.map(media => media.id)
				}
			}
		})

		return new Response()
	} catch (error) {
		console.error(error)
		return Response.json(
			{ error: 'Внутренняя ошибка сервера' },
			{ status: 500 }
		)
	}
}
