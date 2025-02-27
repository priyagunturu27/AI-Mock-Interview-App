import { MainRoutes } from '@/lib/helpers'
import { cn } from '@/lib/utils'
import { NavLink } from 'react-router-dom'

interface navigationRoutesProps {
	isMobile?: boolean
}

const NavigationRoutes = ({ isMobile = false }: navigationRoutesProps) => {
	return (
		<ul
			className={cn(
				'flex items-center gap-5',
				isMobile && 'flex-col items-start gap-6'
			)}>
			{MainRoutes.map((route) => (
				<NavLink
					key={route.href}
					to={route.href}
					className={({ isActive }) =>
						cn(
							'text-base text-neutral-600',
							isActive && 'text-neutral-900 font-semibold'
						)
					}>
					{route.label}
				</NavLink>
			))}
		</ul>
	)
}

export default NavigationRoutes
