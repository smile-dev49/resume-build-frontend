import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div className="max-w-5xl mx-auto">
      <section className="py-12 md:py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Your AI-Powered Resume & Interview Assistant
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Customize your resume, generate cover letters, and prepare interview answers
            tailored to job descriptions using AI technology.
          </p>
          <Link to="/submit-job" className="btn-primary py-3 px-8 text-lg">
            Get Started
          </Link>
        </div>
      </section>

      <section className="py-12 bg-white rounded-xl shadow-md">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our AI assistant analyzes job descriptions and optimizes your application materials
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 px-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Your Resume</h3>
            <p className="text-gray-600">
              Start with your existing resume or let us use our template
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Add Job Details</h3>
            <p className="text-gray-600">
              Paste the job description or provide a link to the job posting
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-primary-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Optimized Results</h3>
            <p className="text-gray-600">
              Receive a tailored resume, cover letter, and interview prep materials
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 my-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Features</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Everything you need to improve your job application process
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="card">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Resume Customization</h3>
              </div>
              <p className="text-gray-600">
                Our AI analyzes job descriptions and tailors your resume to highlight relevant skills and experience,
                improving your chances of making it through applicant tracking systems.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Cover Letter Generation</h3>
              </div>
              <p className="text-gray-600">
                Generate professional, personalized cover letters that complement your resume and
                address specific job requirements without spending hours writing them yourself.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Interview Answer Preparation</h3>
              </div>
              <p className="text-gray-600">
                Prepare for interviews with AI-generated answers to common questions, tailored to your
                experience and the specific job requirements.
              </p>
            </div>
          </div>

          <div className="card">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Competitive Analysis</h3>
              </div>
              <p className="text-gray-600">
                Get insights into the company, its competitors, and strategies to stand out during
                the application and interview process.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Ready to Optimize Your Job Applications?</h2>
        <Link to="/submit-job" className="btn-primary py-3 px-8 text-lg">
          Get Started Now
        </Link>
      </section>
    </div>
  )
}

export default HomePage
