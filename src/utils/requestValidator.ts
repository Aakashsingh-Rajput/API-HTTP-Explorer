
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateUrl = (url: string): ValidationResult => {
  if (!url || url.trim() === '') {
    return { isValid: false, error: 'URL is required' };
  }

  try {
    const urlObj = new URL(url);
    
    // Check if protocol is http or https
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return { isValid: false, error: 'URL must use HTTP or HTTPS protocol' };
    }

    // Check if hostname exists
    if (!urlObj.hostname) {
      return { isValid: false, error: 'Invalid URL format' };
    }

    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Invalid URL format' };
  }
};

export const validateJson = (jsonString: string): ValidationResult => {
  if (!jsonString || jsonString.trim() === '') {
    return { isValid: true }; // Empty JSON is valid
  }

  try {
    JSON.parse(jsonString);
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Invalid JSON format' };
  }
};

export const validateHeaders = (headers: { key: string; value: string }[]): ValidationResult => {
  for (const header of headers) {
    if (header.key && !header.value) {
      return { isValid: false, error: `Header "${header.key}" is missing a value` };
    }
    if (header.value && !header.key) {
      return { isValid: false, error: 'Header key is required when value is provided' };
    }
    
    // Validate header key format (basic validation)
    if (header.key && !/^[a-zA-Z0-9\-_]+$/.test(header.key)) {
      return { isValid: false, error: `Invalid header key format: "${header.key}"` };
    }
  }
  
  return { isValid: true };
};

export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
