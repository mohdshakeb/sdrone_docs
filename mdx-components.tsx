import type { MDXComponents } from 'mdx/types'
import {
  Preview,
  PropsTable,
  CodeBlock,
  Section,
  Callout,
  ColorSwatch,
  VariantCard,
  Specification,
  DocItem,
} from '@/components/docs/mdx'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // Core MDX components for documentation
    Preview,
    PropsTable,
    CodeBlock,
    Section,
    DocItem,
    // Specialized MDX components
    Callout,
    ColorSwatch,
    VariantCard,
    Specification,
  }
}
