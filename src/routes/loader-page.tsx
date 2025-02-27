import { cn } from '@/lib/utils'
import { Loader } from 'lucide-react'

const LoaderPage = ({ className }: { className?: string }) => {
	return (
		<div
			className={cn(
				'w-screen h-screen flex justify-center items-center z-50 bg-transparent',
				className
			)}>
			<Loader className='w-6 h-6 min-w-6 min-h-6 animate-spin' />
		</div>
	)
}

export default LoaderPage
