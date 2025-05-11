'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { useState } from 'react'

/** ReactQueryProvider это провайдер для react-query
 * Он оборачивает все приложение и передает в него queryClient
 * ReactQueryDevtools это инструменты для разработки и отладки react-query
 * Они позволяют отлаживать запросы и кеширование
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
