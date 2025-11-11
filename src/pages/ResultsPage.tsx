import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import apiService from '../services/api'
import type { ResultsData } from '../types'

const ResultsPage = () => {
  const location = useLocation()
  const [data] = useState<ResultsData | null>(location.state as ResultsData)
  const [activeTab, setActiveTab] = useState<'resume' | 'answers'>(() => {
    const initial = (location.state as ResultsData)
    return initial && initial.resume_url ? 'resume' : 'answers'
  })
  const [coverLetterContent, setCoverLetterContent] = useState<string>('')
  const [loadingCoverLetter, setLoadingCoverLetter] = useState<boolean>(false)

  // Load cover letter content when tab changes to answers or when the component mounts
  useEffect(() => {
    const loadCoverLetterContent = async () => {
      if (data?.cover_letter_url && activeTab === 'answers' && !coverLetterContent) {
        try {
          setLoadingCoverLetter(true);
          // Extract the filename from the URL
          const filename = data.cover_letter_url.split('/').pop();
          if (filename) {
            const response = await apiService.get(`/cover_letter/content/${filename}`);
            if (response.data && response.data.content) {
              setCoverLetterContent(response.data.content);
            }
          }
        } catch (error) {
          console.error('Error loading cover letter content:', error);
          toast.error('Failed to load cover letter content');
        } finally {
          setLoadingCoverLetter(false);
        }
      }
    };

    loadCoverLetterContent();
  }, [activeTab, data?.cover_letter_url, coverLetterContent]);

  // Render markdown content with proper HTML
  const renderMarkdown = (markdown: string) => {
    // Handle bold text
    let content = markdown.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Handle italics
    content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Handle links
    content = content.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>');
    
    // Handle headers
    content = content.replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold mb-4">$1</h1>');
    content = content.replace(/^## (.*?)$/gm, '<h2 class="text-xl font-semibold mb-3">$1</h2>');
    content = content.replace(/^### (.*?)$/gm, '<h3 class="text-lg font-medium mb-2">$1</h3>');
    
    // Handle paragraphs - split by double newlines
    const paragraphs = content.split('\n\n');
    return paragraphs.map((p, index) => {
      // Skip empty paragraphs
      if (!p.trim()) return null;
      
      // Handle bullet points
      if (p.startsWith('* ')) {
        const items = p.split('\n* ').map(item => item.replace('* ', ''));
        return (
          <ul key={index} className="list-disc pl-5 mb-4">
            {items.map((item, i) => (
              <li key={i} className="mb-1" dangerouslySetInnerHTML={{ __html: item }} />
            ))}
          </ul>
        );
      }
      
      // Regular paragraph
      return <p key={index} className="mb-4" dangerouslySetInnerHTML={{ __html: p }} />;
    });
  };

  if (!data) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Results Not Found</h1>
        <p className="text-gray-600 mb-8">The requested results could not be found or have expired.</p>
        <Link to="/submit-job" className="btn-primary">
          Create New Resume
        </Link>
      </div>
    )
  }

  const hasResume = Boolean(data?.resume_url)

  // Download icon for buttons
  const DownloadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Application Materials</h1>
        <p className="text-gray-600">
          Your resume, cover letter, and answers have been tailored to match the job description
        </p>
        {data.language && (
          <p className="text-sm text-gray-500 mt-2">
            Output language: {data.language === 'ja' ? 'Japanese' : 'English'}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        {hasResume && (
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'resume' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('resume')}
          >
            Resume
          </button>
        )}
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'answers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('answers')}
        >
          Cover Letter & Answers
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
        {/* Resume Tab */}
        {activeTab === 'resume' && (
          hasResume ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Tailored Resume</h2>
                <a
                  href={apiService.downloadUrl(data.resume_url!, true)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center"
                  download
                >
                  <DownloadIcon />
                  Download PDF
                </a>
              </div>
              <div className="border border-gray-200 rounded p-4 bg-gray-50">
                <div className="aspect-[8.5/11] bg-white mx-auto shadow-lg">
                  <iframe
                    src={apiService.downloadUrl(data.resume_url!)}
                    className="w-full h-full"
                    title="Tailored Resume"
                  ></iframe>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-600">
              <p className="mb-2 font-medium">Resume generation was skipped for this request.</p>
              <p className="text-sm">Select “Resume + cover letter” on the submission form if you need a resume PDF next time.</p>
            </div>
          )
        )}

        {/* Cover Letter & Application Answers Tab */}
        {activeTab === 'answers' && (
          <div className="space-y-8">
            {/* Cover Letter Section */}
            {data.cover_letter_url && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Cover Letter</h2>
                  <a
                    href={apiService.downloadUrl(data.cover_letter_url, true)}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-outline-primary text-sm flex items-center"
                    download
                  >
                    <DownloadIcon />
                    Download PDF
                  </a>
                </div>
                
                <div id="cover-letter-content" className="prose prose-sm max-w-none border border-gray-200 rounded-lg p-6 bg-white">
                  {loadingCoverLetter ? (
                    <p className="text-center text-gray-500">Loading cover letter content...</p>
                  ) : coverLetterContent ? (
                    renderMarkdown(coverLetterContent)
                  ) : (
                    <p className="text-center text-gray-500">No cover letter content available</p>
                  )}
                </div>
                
                <div className="flex justify-end mt-4">
                  <button
                    className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center"
                    onClick={() => {
                      // Get the content from the cover-letter-content div, excluding any loading message
                      const coverLetterContent = document.getElementById('cover-letter-content');
                      if (coverLetterContent) {
                        const textToCopy = coverLetterContent.innerText;
                        if (textToCopy && !textToCopy.includes("Loading cover letter content")) {
                          navigator.clipboard.writeText(textToCopy);
                          toast.success('Cover letter copied to clipboard!');
                        }
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                    </svg>
                    Copy to clipboard
                  </button>
                </div>
              </div>
            )}
            
            {/* Application Answers Section */}
            {data.answers && data.answers.length > 0 && (
              <div className="mt-8">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold">Application Question Answers</h2>
                  <p className="text-gray-600 mt-1">
                    Use these AI-generated answers as a starting point for your application.
                  </p>
                </div>
                <div className="space-y-6">
                  {data.answers.map((answer, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="font-medium text-gray-800 mb-2">Question {index + 1}:</div>
                      <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700 mb-4 ml-2">
                        {answer.split('\n\n').map((paragraph, i) => (
                          <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                        ))}
                      </div>
                      <button
                        className="text-blue-600 text-sm font-medium hover:text-blue-800 flex items-center"
                        onClick={() => {
                          navigator.clipboard.writeText(answer);
                          toast.success('Answer copied to clipboard!');
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                          <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                        </svg>
                        Copy to clipboard
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center mt-8">
        <Link to="/submit-job" className="btn-primary">
          Create Another Application
        </Link>
      </div>
    </div>
  )
}

export default ResultsPage