import Headings from '@/components/headings'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { db } from '@/config/firebase.config'
import { Interview } from '@/types'
import { useAuth } from '@clerk/clerk-react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

const Dashboard = () => {
	const [loading, setLoading] = useState(false)
	const [interviews, setInterviews] = useState<Interview[]>([])
	const { userId } = useAuth()

	useEffect(() => {
		setLoading(true)
		// set upa realtime listener even for the interviews collection where the userId matches

		const interviewQuery = query(
			collection(db, 'interviews'),
			where('userId', '==', userId)
		)

		const unsubscribe = onSnapshot(
			interviewQuery,
			(snapshot) => {
				const interviewList: Interview[] = snapshot.docs.map((doc) =>
					doc.data()
				) as Interview[]
				setInterviews(interviewList)
				setLoading(false)
			},
			(error) => {
				console.log('Error on fetching : ', error)
				toast.error('Error..', {
					description: 'Something went wrong.. Try again later..',
				})
				setLoading(false)
			}
		)

		//  clean up the listener when the component unmount

		return () => unsubscribe()
	}, [userId])

	return (
		<>
			<div className='flex w-full items-center justify-between'>
				{/* headings section */}
				<Headings
					title='Dashboard'
					description='Create and start your AI mock interview'
				/>
				<Link to={'/generate/create'}>
					<Button size={'sm'}>
						<Plus /> Add New
					</Button>
				</Link>
			</div>
			{/* content section */}
			<Separator className='my-8' />
		</>
	)
}
export default Dashboard
