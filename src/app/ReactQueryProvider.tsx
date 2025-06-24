'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { useState } from 'react'

/** ReactQueryProvider это провайдер для react-query
 * используется для управления состоянием запросов и кэширования данных в приложении на React.
 * Он предоставляет контекст для всех дочерних компонентов, позволяя им использовать возможности react-query.
 *
 * @param {React.ReactNode} children - дочерние элементы, которые будут обернуты в провайдер
 * @param {QueryClient} queryClient - клиент для react-query
 */

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
	const [queryClient] = useState(new QueryClient())

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}

export default ReactQueryProvider
