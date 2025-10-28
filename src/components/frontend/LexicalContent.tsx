// src/components/frontend/LexicalContent.tsx
'use client'

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
  [key: string]: any
}

interface LexicalContentProps {
  content: {
    root?: LexicalNode
  }
}

export default function LexicalContent({ content }: LexicalContentProps) {
  if (!content?.root) {
    return <p className="text-gray-600">No content available.</p>
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
          <code key={index} className="bg-gray-100 px-2 py-1 rounded text-sm">
            {text}
          </code>
        ) as any
    }

    return text
  }

  // Paragraph
  if (node.type === 'paragraph') {
    return (
      <p key={index} className="mb-4 text-gray-800 leading-relaxed">
        {node.children?.map((child, i) => renderNode(child, i))}
      </p>
    )
  }

  // Heading nodes
  if (node.type === 'heading') {
    const tag = node.tag || 'h2'
    const classes: Record<string, string> = {
      h1: 'text-4xl font-bold mt-8 mb-4 text-gray-900',
      h2: 'text-3xl font-bold mt-8 mb-4 text-gray-900',
      h3: 'text-2xl font-bold mt-6 mb-3 text-gray-900',
      h4: 'text-xl font-bold mt-6 mb-3 text-gray-900',
      h5: 'text-lg font-bold mt-4 mb-2 text-gray-900',
      h6: 'text-base font-bold mt-4 mb-2 text-gray-900',
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
      <li key={index} className="text-gray-800">
        {node.children?.map((child, i) => renderNode(child, i))}
      </li>
    )
  }

  // Quote/blockquote
  if (node.type === 'quote') {
    return (
      <blockquote key={index} className="border-l-4 border-blue-600 pl-4 italic my-6 text-gray-700">
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

  // Link
  if (node.type === 'link') {
    return (
      <a
        key={index}
        href={node.url}
        target={node.target || '_self'}
        rel={node.rel}
        className="text-blue-600 hover:text-blue-800 underline"
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
    return <hr key={index} className="my-8 border-t-2 border-gray-200" />
  }

  // Image (if you have image nodes)
  if (node.type === 'image') {
    return (
      <img key={index} src={node.src} alt={node.altText || ''} className="rounded-lg my-6 w-full" />
    )
  }

  // Default: render children if they exist
  if (node.children) {
    return <div key={index}>{node.children.map((child, i) => renderNode(child, i))}</div>
  }

  return null
}
