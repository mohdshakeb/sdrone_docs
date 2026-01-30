#!/usr/bin/env node

import { parse } from 'react-docgen-typescript';
import { glob } from 'glob';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parser options
const options = {
  savePropValueAsString: true,
  shouldExtractLiteralValuesFromEnum: true,
  shouldRemoveUndefinedFromOptional: true,
  propFilter: (prop) => {
    // Filter out props from node_modules
    if (prop.parent) {
      return !/node_modules/.test(prop.parent.fileName);
    }
    return true;
  },
};

async function extractComponentProps() {
  console.log('🔍 Extracting component props...\n');

  // Find all component files in components/ui
  const componentFiles = await glob('components/ui/*.tsx', {
    ignore: [
      '**/index.ts',
      '**/index.tsx',
      '**/*.module.css',
      '**/ThemeProvider.tsx', // Skip provider components
    ],
  });

  // Create output directory
  const outputDir = 'public/component-props';
  mkdirSync(outputDir, { recursive: true });

  const results = {};

  for (const file of componentFiles) {
    try {
      const componentName = basename(file, '.tsx');
      console.log(`📄 Processing ${componentName}...`);

      // Parse the component file
      const docs = parse(file, options);

      if (docs.length === 0) {
        console.log(`   ⚠️  No exported components found\n`);
        continue;
      }

      // Find the main Props interface (e.g., ButtonProps, BadgeProps)
      const propsInterface = docs.find(
        (doc) => doc.displayName === `${componentName}Props`
      );

      // Use the props interface if found, otherwise use the first exported component
      const mainDoc = propsInterface || docs[0];

      if (!mainDoc) {
        console.log(`   ⚠️  No documentation found\n`);
        continue;
      }

      // Extract prop information
      const props = [];
      if (mainDoc.props) {
        for (const [name, prop] of Object.entries(mainDoc.props)) {
          try {
            let typeName = prop.type?.name || 'unknown';
            if (typeName === 'enum' && prop.type?.value && Array.isArray(prop.type.value)) {
              typeName = prop.type.value.map(v => v.value).join(' | ');
            }

            const propData = {
              name,
              type: typeName,
              required: prop.required || false,
              description: prop.description || '',
              defaultValue: prop.defaultValue?.value,
            };
            props.push(propData);
          } catch (err) {
            console.log(`   ⚠️  Skipping prop ${name}: ${err.message}`);
          }
        }
      }

      // Store in results
      results[componentName] = {
        componentName,
        description: mainDoc.description || '',
        props,
        filePath: file,
      };

      console.log(`   ✅ Extracted ${props.length} props\n`);
    } catch (error) {
      console.error(`   ❌ Error processing ${file}:`, error.message, '\n');
    }
  }

  // Write combined results
  const outputFile = `${outputDir}/all-components.json`;
  writeFileSync(outputFile, JSON.stringify(results, null, 2));
  console.log(`\n✨ Props extracted to ${outputFile}`);
  console.log(`📊 Processed ${Object.keys(results).length} components`);
}

extractComponentProps().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
