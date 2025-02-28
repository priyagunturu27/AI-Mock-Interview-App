import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'

import { Interview } from '@/types'
import CustomBreadCrumb from './custom-bread-crumb'
import { useEffect, useState } from 'react'
import { replace, useNavigate } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import { toast } from 'sonner'
import Headings from './headings'
import { Button } from './ui/button'
import { Loader, Trash2 } from 'lucide-react'
import { Separator } from './ui/separator'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { chatSession } from '@/scripts'
import {
	addDoc,
	collection,
	doc,
	serverTimestamp,
	updateDoc,
} from 'firebase/firestore'
import { db } from '@/config/firebase.config'

interface FormMockInterviewProps {
	initialData: Interview | null
}

const formSchema = z.object({
	position: z
		.string()
		.min(1, 'Position is required')
		.max(100, 'Position must be 100 characters or less'),
	description: z.string().min(10, 'Description is required'),
	experience: z.coerce
		.number()
		.min(0, 'Experience cannot be empty or negative'),
	techStack: z.string().min(1, 'Tech stack must be at least a character'),
})

type formData = z.infer<typeof formSchema>

const FormMockInterview = ({ initialData }: FormMockInterviewProps) => {
	const form = useForm<formData>({
		resolver: zodResolver(formSchema),
		defaultValues: initialData || {},
	})
	const { isSubmitting, isValid } = form.formState
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()
	const { userId } = useAuth()

	const title = initialData?.position
		? initialData?.position
		: 'Create A New Mock Interview'

	const breadCrumpPage = initialData?.position
		? initialData?.position
		: 'Create'

	const actions = initialData ? 'Save Changes' : 'Create'
	const toastMessage = initialData
		? { title: 'Updated..!', description: 'Changes saved successfully...' }
		: { title: 'Created..!', description: 'New Mock Interview created...' }

	const cleanAiResponse = (responseText: string) => {
		// Step 1: Trim any surrounding whitespace
		let cleanText = responseText.trim()

		// Step 2: Remove any occurrences of "json" or code block symbols (``` or `)
		cleanText = cleanText.replace(/(json|```|`)/g, '')

		// Step 3: Extract a JSON array by capturing text between square brackets
		const jsonArrayMatch = cleanText.match(/\[.*\]/s)
		if (jsonArrayMatch) {
			cleanText = jsonArrayMatch[0]
		} else {
			throw new Error('No JSON array found in response')
		}

		// Step 4: Parse the clean JSON text into an array of objects
		try {
			return JSON.parse(cleanText)
		} catch (error) {
			throw new Error('Invalid JSON format: ' + (error as Error)?.message)
		}
	}

	const generateAiResult = async (data: formData) => {
		const prompt = `
            As an experienced prompt engineer, generate a JSON array containing 5 technical interview questions along with detailed answers based on the following job information. Each object in the array should have the fields "question" and "answer", formatted as follows:

            [
              { "question": "<Question text>", "answer": "<Answer text>" },
              ...
            ]

            Job Information:
            - Job Position: ${data?.position}
            - Job Description: ${data?.description}
            - Years of Experience Required: ${data?.experience}
            - Tech Stacks: ${data?.techStack}

            The questions should assess skills in ${data?.techStack} development and best practices, problem-solving, and experience handling complex requirements. Please format the output strictly as an array of JSON objects without any additional labels, code blocks, or explanations. Return only the JSON array with questions and answers.
            `

		const aiResult = await chatSession.sendMessage(prompt)
		const cleanedResponse = cleanAiResponse(aiResult.response.text())

		return cleanedResponse
	}

	const onSubmit = async (data: FormData) => {
		try {
			setLoading(true)
			if (initialData) {
				//update
				if (isValid) {
					// create a new mock interview
					const aiResult = await generateAiResult(data)

					await updateDoc(doc(db, 'interviews', initialData?.id), {
						questions: aiResult,
						...data,
						updatedAt: serverTimestamp(),
					})

					toast(toastMessage.title, { description: toastMessage.description })
				}
			} else {
				if (isValid) {
					const aiResult = await generateAiResult(data)
					await addDoc(collection(db, 'interviews'), {
						...data,
						userId,
						questions: aiResult,
						createdAt: serverTimestamp(),
					})
					toast(toastMessage.title, { description: toastMessage.description })
				}
			}
			navigate('/generate', { replace: true })
		} catch (error) {
			console.log(error)
			toast.error('Error...', {
				description: `something went wrong, Please try again!`,
			})
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (initialData) {
			form.reset({
				position: initialData.position,
				description: initialData.description,
				experience: initialData.experience,
				techStack: initialData.techStack,
			})
		}
	}, [initialData, form])

	return (
		<div className='w-full flex-col space-y-4'>
			<CustomBreadCrumb
				breadCrumbPage={breadCrumpPage}
				breadCrumpItems={[{ label: 'Mock Interview', link: '/generate' }]}
			/>
			<div className='mt-4 flex items-center justify-between w-fulls'>
				<Headings
					title={title}
					isSubHeading
				/>
				{initialData && (
					<Button
						size={'icon'}
						variant={'ghost'}>
						<Trash2 className='min-w-4 min-h-4 text-red-500' />
					</Button>
				)}
			</div>
			<Separator className='my-4' />

			<div className='my-6'></div>
			<FormProvider {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='w-full flex flex-col items-start justify-start gap-6 p-8 shadow-md rounded-lg '>
					<FormField
						control={form.control}
						name='position'
						render={({ field }) => (
							<FormItem className='w-full space-y-4'>
								<div className='w-full flex items-center justify-between'>
									<FormLabel>Job Role / Job Position</FormLabel>
									<FormMessage className='text-sm' />
								</div>
								<FormControl>
									<Input
										className='h-12'
										disabled={loading}
										placeholder='eg:- Full Stack Developer'
										{...field}
										value={field.value || ''}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					{/* description */}
					<FormField
						control={form.control}
						name='description'
						render={({ field }) => (
							<FormItem className='w-full space-y-4'>
								<div className='w-full flex items-center justify-between'>
									<FormLabel>Job Description</FormLabel>
									<FormMessage className='text-sm' />
								</div>
								<FormControl>
									<Textarea
										placeholder='eg:- Describe your job role'
										{...field}
										value={field.value || ''}
										className='h-12'
										disabled={loading}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					{/* experience */}
					<FormField
						control={form.control}
						name='experience'
						render={({ field }) => (
							<FormItem className='w-full space-y-4'>
								<div className='w-full flex items-center justify-between'>
									<FormLabel>Years of Experience</FormLabel>
									<FormMessage className='text-sm' />
								</div>
								<FormControl>
									<Input
										{...field}
										type='number'
										className='h-12'
										disabled={loading}
										placeholder='eg:- 5 years'
										value={field.value || ''}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					{/* tech stack */}
					<FormField
						control={form.control}
						name='techStack'
						render={({ field }) => (
							<FormItem className='w-full space-y-4'>
								<div className='w-full flex items-center justify-between'>
									<FormLabel>Tech Stacks</FormLabel>
									<FormMessage className='text-sm' />
								</div>
								<FormControl>
									<Textarea
										{...field}
										className='h-12'
										disabled={loading}
										placeholder='eg:- Javascript, Typescript...(seperate each values using comma)'
										value={field.value || ''}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					{/* submitting */}
					<div className='w-full flex items-center justify-end gap-6'>
						<Button
							type='reset'
							size={'sm'}
							variant={'outline'}
							disabled={isSubmitting || loading}>
							Reset
						</Button>
						<Button
							type='submit'
							size={'sm'}
							disabled={isSubmitting || !isValid || loading}>
							{loading ? (
								<Loader className='text-gray-50 animate-spin' />
							) : (
								actions
							)}
						</Button>
					</div>
				</form>
			</FormProvider>
		</div>
	)
}

export default FormMockInterview
