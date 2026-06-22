import type { ReactNode } from 'react'
import { Fragment } from 'react'
import { cn } from '@/lib/utils'
import { isValidExternalUrl } from '@/lib/portfolio'

/**
 * Dependency-free markdown renderer. Parses a safe subset of markdown into
 * React elements directly (no dangerouslySetInnerHTML), so untrusted content
 * can never inject HTML/scripts. Supports: #/##/### headings, paragraphs,
 * - / * / + and 1. lists, > blockquotes, --- rules, **bold**, *italic*,
 * `code`, and [text](url) links. Never crashes on empty input.
 */

/* -------------------------------- inline -------------------------------- */

// Split inline markdown into React nodes: links, bold, italic, code.
function renderInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let remaining = text
  let i = 0

  // Ordered patterns; first match at the earliest index wins.
  const patterns: {
    re: RegExp
    render: (m: RegExpExecArray, key: string) => ReactNode
  }[] = [
    {
      // [label](url)
      re: /\[([^\]]+)\]\(([^)\s]+)\)/,
      render: (m, key) => {
        const href = m[2]
        const safe = isValidExternalUrl(href) || href.startsWith('/') || href.startsWith('#')
        if (!safe) return <Fragment key={key}>{m[1]}</Fragment>
        const external = /^https?:\/\//.test(href)
        return (
          <a
            key={key}
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="font-medium text-gold underline decoration-gold/40 underline-offset-4 transition-colors hover:text-warm-gold hover:decoration-gold"
          >
            {m[1]}
          </a>
        )
      },
    },
    {
      re: /\*\*([^*]+)\*\*|__([^_]+)__/,
      render: (m, key) => (
        <strong key={key} className="font-semibold text-sand">
          {m[1] ?? m[2]}
        </strong>
      ),
    },
    {
      re: /\*([^*]+)\*|_([^_]+)_/,
      render: (m, key) => (
        <em key={key} className="italic">
          {m[1] ?? m[2]}
        </em>
      ),
    },
    {
      re: /`([^`]+)`/,
      render: (m, key) => (
        <code
          key={key}
          className="rounded bg-espresso/70 px-1.5 py-0.5 font-mono text-[0.85em] text-warm-gold"
        >
          {m[1]}
        </code>
      ),
    },
  ]

  while (remaining.length > 0) {
    let best: { index: number; match: RegExpExecArray; renderIdx: number } | null = null
    for (let p = 0; p < patterns.length; p++) {
      const m = patterns[p].re.exec(remaining)
      if (m && (best === null || m.index < best.index)) {
        best = { index: m.index, match: m, renderIdx: p }
      }
    }
    if (!best) {
      nodes.push(<Fragment key={`${keyBase}-t${i}`}>{remaining}</Fragment>)
      break
    }
    if (best.index > 0) {
      nodes.push(
        <Fragment key={`${keyBase}-t${i}`}>{remaining.slice(0, best.index)}</Fragment>,
      )
      i++
    }
    nodes.push(patterns[best.renderIdx].render(best.match, `${keyBase}-m${i}`))
    i++
    remaining = remaining.slice(best.index + best.match[0].length)
  }

  return nodes
}

/* -------------------------------- blocks -------------------------------- */

type Block =
  | { type: 'heading'; level: 2 | 3 | 4; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'quote'; text: string }
  | { type: 'hr' }
  | { type: 'p'; text: string }

function parseBlocks(md: string): Block[] {
  const lines = md.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
  const blocks: Block[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const trimmed = line.trim()

    if (trimmed === '') {
      i++
      continue
    }

    // Horizontal rule
    if (/^([-*_])\s*(\1\s*){2,}$/.test(trimmed)) {
      blocks.push({ type: 'hr' })
      i++
      continue
    }

    // Heading (#, ##, ###, ####) — map # and ## to h2, ### to h3, #### to h4
    const heading = /^(#{1,6})\s+(.*)$/.exec(trimmed)
    if (heading) {
      const hashes = heading[1].length
      const level: 2 | 3 | 4 = hashes <= 2 ? 2 : hashes === 3 ? 3 : 4
      blocks.push({ type: 'heading', level, text: heading[2].trim() })
      i++
      continue
    }

    // Blockquote (collect consecutive > lines)
    if (/^>\s?/.test(trimmed)) {
      const quote: string[] = []
      while (i < lines.length && /^\s*>\s?/.test(lines[i])) {
        quote.push(lines[i].replace(/^\s*>\s?/, ''))
        i++
      }
      blocks.push({ type: 'quote', text: quote.join(' ').trim() })
      continue
    }

    // Unordered list
    if (/^[-*+]\s+/.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*+]\s+/, '').trim())
        i++
      }
      blocks.push({ type: 'ul', items })
      continue
    }

    // Ordered list
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = []
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, '').trim())
        i++
      }
      blocks.push({ type: 'ol', items })
      continue
    }

    // Paragraph (collect consecutive non-blank, non-special lines)
    const para: string[] = []
    while (i < lines.length) {
      const l = lines[i]
      const lt = l.trim()
      if (
        lt === '' ||
        /^(#{1,6})\s+/.test(lt) ||
        /^>\s?/.test(lt) ||
        /^[-*+]\s+/.test(lt) ||
        /^\d+\.\s+/.test(lt) ||
        /^([-*_])\s*(\1\s*){2,}$/.test(lt)
      ) {
        break
      }
      para.push(lt)
      i++
    }
    blocks.push({ type: 'p', text: para.join(' ') })
  }

  return blocks
}

export function MarkdownRenderer({
  content,
  className,
}: {
  content: string | null | undefined
  className?: string
}) {
  const text = (content ?? '').trim()
  if (!text) return null

  const blocks = parseBlocks(text)

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      {blocks.map((block, idx) => {
        const key = `b${idx}`
        switch (block.type) {
          case 'heading': {
            if (block.level === 2) {
              return (
                <h2
                  key={key}
                  className="mt-4 flex items-center gap-3 font-heading text-2xl font-semibold text-sand sm:text-3xl"
                >
                  <span className="h-5 w-1 rounded-full bg-gold" aria-hidden="true" />
                  {renderInline(block.text, key)}
                </h2>
              )
            }
            if (block.level === 3) {
              return (
                <h3
                  key={key}
                  className="mt-2 font-heading text-xl font-semibold text-sand sm:text-2xl"
                >
                  {renderInline(block.text, key)}
                </h3>
              )
            }
            return (
              <h4
                key={key}
                className="font-heading text-lg font-semibold text-sand/90"
              >
                {renderInline(block.text, key)}
              </h4>
            )
          }
          case 'ul':
            return (
              <ul key={key} className="flex flex-col gap-2 pl-1">
                {block.items.map((item, j) => (
                  <li key={`${key}-${j}`} className="flex gap-3 text-pretty leading-relaxed text-muted-foreground">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" aria-hidden="true" />
                    <span>{renderInline(item, `${key}-${j}`)}</span>
                  </li>
                ))}
              </ul>
            )
          case 'ol':
            return (
              <ol key={key} className="flex flex-col gap-2 pl-1">
                {block.items.map((item, j) => (
                  <li key={`${key}-${j}`} className="flex gap-3 text-pretty leading-relaxed text-muted-foreground">
                    <span className="font-mono text-sm font-medium text-gold">{j + 1}.</span>
                    <span>{renderInline(item, `${key}-${j}`)}</span>
                  </li>
                ))}
              </ol>
            )
          case 'quote':
            return (
              <blockquote
                key={key}
                className="border-l-2 border-gold/50 bg-card/40 px-5 py-3 text-pretty italic leading-relaxed text-sand/80"
              >
                {renderInline(block.text, key)}
              </blockquote>
            )
          case 'hr':
            return <hr key={key} className="border-gold/15" />
          case 'p':
          default:
            return (
              <p key={key} className="text-pretty leading-relaxed text-muted-foreground">
                {renderInline(block.text, key)}
              </p>
            )
        }
      })}
    </div>
  )
}
