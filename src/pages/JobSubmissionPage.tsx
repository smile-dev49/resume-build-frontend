import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import apiService from '../services/api'
import type { SimpleJobSubmission } from '@/types'

const JobSubmissionPage = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [templates, setTemplates] = useState([]);

  const fetchTemplates = async () => {
    const { data } = await apiService.get('/templates');
    setTemplates(data);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const { register, control, handleSubmit, formState: { errors } } = useForm<SimpleJobSubmission>({
    defaultValues: {
      job_description: '',
      questions: [''],
      template: '',
      language: 'en',
      cover_letter_only: true,
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    // @ts-ignore
    name: "questions",
  })

  const onSubmit = async (data: SimpleJobSubmission) => {
    // Validate job description is provided
    if (!data.job_description) {
      toast.error('Please provide a job description')
      return
    }

    try {
      setIsSubmitting(true)

      // Filter out empty questions
      const filteredQuestions = data.questions?.filter(q => q.trim() !== '') || []

      // Create job data object for JSON submission
      const jobData = {
        job_description: data.job_description,
        questions: filteredQuestions.length > 0 ? filteredQuestions : undefined,
        return_json: false,
        template: data.template,
        language: data.language || 'en',
        cover_letter_only: data.cover_letter_only ?? true,
      }

      // Submit the job data as JSON
      const response = await apiService.post('/tailor-resume', jobData)

      // Navigate to results page
      navigate('/results', { state: response.data })
    } catch (error) {
      console.error('Error submitting job:', error)
      toast.error('Failed to process your request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Create Your Tailored Resume</h1>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card-body">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Resume Template</h2>

              <div className="card-footer flex justify-end">
                <button
                  type="submit"
                  className="btn-primary py-2 px-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Create Tailored Resume & Cover Letter'}
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="template">
                  Select a template
                </label>
                <select
                  id="template"
                  className="input-field"
                  {...register('template', { required: 'Template selection is required' })}
                >
                  {templates.map((template) => (
                    <option key={template} value={template}>
                      {template}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="language">
                    Output language
                  </label>
                  <select
                    id="language"
                    className="input-field"
                    {...register('language')}
                  >
                    <option value="en">English</option>
                    <option value="ja">日本語 (Japanese)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="cover_letter_only">
                    Document output
                  </label>
                  <select
                    id="cover_letter_only"
                    className="input-field"
                    {...register('cover_letter_only', {
                      setValueAs: (value) => value === 'true',
                    })}
                  >
                    <option value="true">Cover letter only</option>
                    <option value="false">Resume + cover letter</option>
                  </select>
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-4">Job Description</h2>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="job_description">
                  Paste the job description below
                </label>
                <textarea
                  id="job_description"
                  className="textarea-field h-60"
                  placeholder="Paste the complete job description here"
                  {...register('job_description', {
                    required: 'Job description is required'
                  })}
                ></textarea>
                {errors.job_description && (
                  <p className="text-red-500 text-xs mt-1">{errors.job_description.message}</p>
                )}
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Application Questions (Optional)</h2>
              <p className="text-gray-600 mb-4">
                Add any questions from the job application that you'd like AI to help answer based on your resume.
              </p>

              {fields.map((field, index) => (
                <div key={field.id} className="flex mb-3">
                  <div className="flex-grow mr-2">
                    <input
                      className="input-field w-full"
                      placeholder={`Question ${index + 1}`}
                      {...register(`questions.${index}` as const)}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn-outline-danger"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="btn-outline-primary mt-2"
                onClick={() => append('')}
              >
                Add Question
              </button>
            </div>
          </div>

          <div className="card-footer flex justify-end">
            <button
              type="submit"
              className="btn-primary py-2 px-6"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Create Tailored Resume & Cover Letter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default JobSubmissionPage
