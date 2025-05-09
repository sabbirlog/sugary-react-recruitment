'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// create client
const client = new QueryClient()

const ReactQueryProvider = ({ children }: {
    children: React.ReactNode
}) => {
    return (
        <QueryClientProvider client={client}>
            {children}
            <ReactQueryDevtools />
        </QueryClientProvider>
    )
}

export default ReactQueryProvider