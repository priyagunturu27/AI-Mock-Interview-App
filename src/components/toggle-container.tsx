import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import NavigationRoutes from './navigation-routes'
import { useAuth } from '@clerk/clerk-react'
import { cn } from '@/lib/utils'

const ToggleContainer = () => {
	const { userId } = useAuth()
	return (
		<Sheet>
			<SheetTrigger className=' block md:hidden'>
				<Menu />
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle></SheetTitle>
					<nav className='flex flex-col items-start gap-6'>
						<NavigationRoutes isMobile />
						{userId && (
							<NavLink
								to={'/generate'}
								className={({ isActive }) =>
									cn(
										'text-base text-neutral-600',
										isActive && 'text-neutral-900 font-semibold'
									)
								}>
								Take an interview
							</NavLink>
						)}
					</nav>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	)
}

export default ToggleContainer
