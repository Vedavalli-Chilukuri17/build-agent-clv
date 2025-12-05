// Utility functions for handling ServiceNow field values
// Always use sysparm_display_value=all in API calls to ensure these functions work properly

export const display = (field) => {
  // Handle ServiceNow field objects with display_value and value properties
  if (typeof field === 'object' && field !== null && field.display_value !== undefined) {
    return field.display_value;
  }
  
  // Handle plain string values
  if (typeof field === 'string') {
    return field;
  }
  
  // Return empty string for null/undefined
  return '';
};

export const value = (field) => {
  // Handle ServiceNow field objects with display_value and value properties
  if (typeof field === 'object' && field !== null && field.value !== undefined) {
    return field.value;
  }
  
  // Handle plain string values
  if (typeof field === 'string') {
    return field;
  }
  
  // Return empty string for null/undefined
  return '';
};