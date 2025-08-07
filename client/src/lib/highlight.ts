import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import json from 'highlight.js/lib/languages/json'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import bash from 'highlight.js/lib/languages/bash'
import 'highlight.js/styles/github-dark.css'

// Register common languages
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('json', json)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('bash', bash)

export const highlightCode = (code: string, language: string = 'text') => {
  try {
    const codeString = typeof code === 'string' ? code : String(code)

    const result = hljs.highlight(codeString, {
      language: language || 'text',
    })

    return result.value
  } catch (error) {
    console.warn(`Failed to highlight code for language: ${language}`, error)
    // Return the original code if highlighting fails
    return typeof code === 'string' ? code : String(code)
  }
}

// Simple syntax highlighting using CSS classes
export const getCodeClassName = (language: string) => {
  const baseClass = 'font-mono text-sm'

  switch (language) {
    case 'javascript':
      return `${baseClass} text-orange-400`
    case 'typescript':
      return `${baseClass} text-blue-400`
    case 'python':
      return `${baseClass} text-green-400`
    case 'json':
      return `${baseClass} text-yellow-400`
    case 'css':
      return `${baseClass} text-purple-400`
    case 'bash':
      return `${baseClass} text-red-400`
    default:
      return `${baseClass} text-accent`
  }
}
