import { useState, useEffect, useMemo } from 'react';
import { JsonValidationResult } from '@/types';

export function useJsonValidation(jsonString: string): JsonValidationResult {
  const [result, setResult] = useState<JsonValidationResult>({
    isValid: false,
    error: undefined,
    prettifiedJson: undefined,
  });

  const validateAndPrettify = useMemo(() => {
    if (!jsonString.trim()) {
      return {
        isValid: false,
        error: 'JSON is empty',
        prettifiedJson: undefined,
      };
    }

    try {
      const parsed = JSON.parse(jsonString);
      const prettified = JSON.stringify(parsed, null, 2);
      
      return {
        isValid: true,
        error: undefined,
        prettifiedJson: prettified,
      };
    } catch (error) {
      let errorMessage = 'Invalid JSON';
      
      if (error instanceof SyntaxError) {
        // Extract more specific error information
        const message = error.message;
        if (message.includes('Unexpected token')) {
          const match = message.match(/Unexpected token (.) in JSON at position (\d+)/);
          if (match) {
            const [, token, position] = match;
            errorMessage = `Unexpected token '${token}' at position ${position}`;
          }
        } else if (message.includes('Unexpected end of JSON input')) {
          errorMessage = 'Unexpected end of JSON input - check for missing closing brackets';
        } else if (message.includes('Expected property name')) {
          errorMessage = 'Expected property name in double quotes';
        } else {
          errorMessage = message;
        }
      }

      return {
        isValid: false,
        error: errorMessage,
        prettifiedJson: undefined,
      };
    }
  }, [jsonString]);

  useEffect(() => {
    setResult(validateAndPrettify);
  }, [validateAndPrettify]);

  return result;
} 