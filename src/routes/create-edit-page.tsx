import FormMockInterview from '@/components/form-mock-interview'
import { db } from '@/config/firebase.config'
import { Interview } from '@/types'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const CreateEditPage = () => {
	const { interviewId } = useParams<{ interviewId: string }>()
	const [interview, setInterview] = useState<Interview | null>(null)

	useEffect(() => {
		const fetchInterviews = async () => {
			if (interviewId) {
				try {
					const interviewDoc = await getDoc(doc(db, 'interviews', interviewId))
					if (interviewDoc.exists()) {
						setInterview({
							id: interviewDoc.id,
							...interviewDoc.data(),
						} as Interview)
					}
				} catch (error) {
					console.log(error)
				}
			}
		}
		fetchInterviews()
	}, [interviewId])

	return (
		<div className='flex-col w-full my-4'>
			<FormMockInterview initialData={interview} />
		</div>
	)
}

export default CreateEditPage
