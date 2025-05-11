import { Prisma } from '@prisma/client'

export const userDataSelect = {
	id: true,
	username: true,
	name: true,
	avatarUrl: true
} satisfies Prisma.UserSelect

export const postDataInclude = {
	user: {
		select: {
			username: true,
			name: true,
			avatarUrl: true
		}
	}
} satisfies Prisma.PostInclude

export type PostData = Prisma.PostGetPayload<{
	include: typeof postDataInclude
}>
