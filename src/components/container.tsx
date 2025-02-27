import { cn } from '@/lib/utils'

interface containerProps {
	children: React.ReactNode
	className?: string
}

export default function Container({ children, className }: containerProps) {
	return (
		<div
			className={cn('container mx-auto px-2 md:px-2 py-4 w-full', className)}>
			{children}
		</div>
	)
}
