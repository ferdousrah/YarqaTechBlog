// src/components/frontend/LexicalContent.tsx
'use client'

import { ContentImage } from '@/components/ContentImage'

interface LexicalNode {
  type: string
  version: number
  children?: LexicalNode[]
  text?: string
  format?: number
  mode?: string
  style?: string
  indent?: number
  direction?: string
  tag?: string
  blockType?: string
  fields?: any
  [key: string]: any
}

interface LexicalContentProps {
  content: any
}

export default function LexicalContent({ content }: LexicalContentProps) {
  if (!content?.root) {
    return <p className="text-gray-600 dark:text-gray-400">No content available.</p>
  }

  return <div className="prose prose-lg max-w-none">{renderNode(content.root)}</div>
}

function renderNode(node: LexicalNode, index: number = 0): React.ReactNode {
  if (!node) return null

  // Text node
  if (node.type === 'text') {
    let text = node.text || ''

    // Apply formatting
    if (node.format && node.format > 0) {
      if (node.format & 1) text = (<strong key={index}>{text}</strong>) as any
      if (node.format & 2) text = (<em key={index}>{text}</em>) as any
      if (node.format & 8)
        text = (
          <code key={index} className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm dark:text-gray-200">
            {text}
          </code>
        ) as any
    }

    return text
  }

  // Paragraph
  if (node.type === 'paragraph') {
    return (
      <p key={index} className="mb-4 text-gray-800 dark:text-gray-300 leading-relaxed">
        {node.children?.map((child, i) => renderNode(child, i))}
      </p>
    )
  }

  // Heading nodes
  if (node.type === 'heading') {
    const tag = node.tag || 'h2'
    const classes: Record<string, string> = {
      h1: 'text-4xl font-bold mt-8 mb-4 text-gray-900 dark:text-white',
      h2: 'text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white',
      h3: 'text-2xl font-bold mt-6 mb-3 text-gray-900 dark:text-white',
      h4: 'text-xl font-bold mt-6 mb-3 text-gray-900 dark:text-white',
      h5: 'text-lg font-bold mt-4 mb-2 text-gray-900 dark:text-white',
      h6: 'text-base font-bold mt-4 mb-2 text-gray-900 dark:text-white',
    }

    const Component = tag as keyof JSX.IntrinsicElements
    return (
      <Component key={index} className={classes[tag]}>
        {node.children?.map((child, i) => renderNode(child, i))}
      </Component>
    )
  }

  // List nodes
  if (node.type === 'list') {
    const ListTag = node.listType === 'number' ? 'ol' : 'ul'
    return (
      <ListTag key={index} className="ml-6 mb-4 space-y-2">
        {node.children?.map((child, i) => renderNode(child, i))}
      </ListTag>
    )
  }

  if (node.type === 'listitem') {
    return (
      <li key={index} className="text-gray-800 dark:text-gray-300">
        {node.children?.map((child, i) => renderNode(child, i))}
      </li>
    )
  }

  // Quote/blockquote
  if (node.type === 'quote') {
    return (
      <blockquote key={index} className="border-l-4 border-blue-600 dark:border-blue-400 pl-4 italic my-6 text-gray-700 dark:text-gray-300">
        {node.children?.map((child, i) => renderNode(child, i))}
      </blockquote>
    )
  }

  // Code block
  if (node.type === 'code') {
    return (
      <pre key={index} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6">
        <code>{node.children?.map((child, i) => renderNode(child, i))}</code>
      </pre>
    )
  }

  // Link (support both 'link' and 'autolink' types)
  if (node.type === 'link' || node.type === 'autolink') {
    const url = node.url || node.fields?.url || node.fields?.linkType === 'custom' ? node.fields?.url : ''

    return (
      <a
        key={index}
        href={url}
        target={node.target || node.fields?.newTab ? '_blank' : '_self'}
        rel={node.rel || (node.fields?.newTab ? 'noopener noreferrer' : undefined)}
        className="text-blue-600 hover:text-blue-800 underline transition-colors"
      >
        {node.children?.map((child, i) => renderNode(child, i))}
      </a>
    )
  }

  // Line break
  if (node.type === 'linebreak') {
    return <br key={index} />
  }

  // Horizontal rule
  if (node.type === 'horizontalrule') {
    return <hr key={index} className="my-8 border-t-2 border-gray-200 dark:border-gray-700" />
  }

  // Image (if you have image nodes)
  if (node.type === 'image') {
    return <ContentImage key={index} src={node.src} alt={node.altText || ''} />
  }

  // Upload node (inline images from Lexical upload feature)
  if (node.type === 'upload') {
    const value = node.value || node.fields?.value
    const relationTo = node.relationTo || node.fields?.relationTo

    if (value && typeof value === 'object' && value.url && relationTo === 'media') {
      return (
        <ContentImage
          key={index}
          src={value.url}
          alt={value.alt || 'Content image'}
          caption={value.caption}
        />
      )
    }
  }

  // Block nodes (for custom blocks like MediaBlock, Banner, Code)
  if (node.type === 'block') {
    const blockType = node.fields?.blockType

    // MediaBlock - render image
    if (blockType === 'mediaBlock') {
      const media = node.fields?.media

      if (media && typeof media === 'object' && media.url) {
        return (
          <ContentImage
            key={index}
            src={media.url}
            alt={media.alt || 'Content image'}
            caption={media.caption}
          />
        )
      }
    }

    // Banner block
    if (blockType === 'banner') {
      const content = node.fields?.content
      const style = node.fields?.style || 'info'

      const styleClasses = {
        info: 'bg-blue-50 border-blue-200 text-blue-900',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
        error: 'bg-red-50 border-red-200 text-red-900',
        success: 'bg-green-50 border-green-200 text-green-900',
      }

      return (
        <div
          key={index}
          className={`my-6 p-6 border-l-4 rounded-r-lg ${styleClasses[style as keyof typeof styleClasses] || styleClasses.info}`}
        >
          {content && renderNode({ ...content, type: 'paragraph' })}
        </div>
      )
    }

    // Code block (custom block)
    if (blockType === 'code') {
      const code = node.fields?.code || ''
      const language = node.fields?.language || 'text'

      return (
        <div key={index} className="my-6">
          <div className="bg-gray-900 rounded-t-lg px-4 py-2">
            <span className="text-gray-400 text-xs font-mono uppercase">{language}</span>
          </div>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-b-lg overflow-x-auto">
            <code>{code}</code>
          </pre>
        </div>
      )
    }
  }

  // Default: render children if they exist
  if (node.children) {
    return <div key={index}>{node.children.map((child, i) => renderNode(child, i))}</div>
  }

  return null
}
