function parseData(input) {
    let obj = input;
  
    // 1. If input is a JSON string, parse it
    if (typeof obj === 'string') {
      try {
        obj = JSON.parse(obj);
      } catch (err) {
        throw new TypeError('Invalid JSON string passed to parseData');
      }
    }
  
    // 2. If it's already an array, return as-is
    if (Array.isArray(obj)) {
      return obj;
    }
  
    // 3. If it's a DB result object with 'rows'
    if (obj && Array.isArray(obj.rows)) {
      return obj.rows;
    }
  
    // 4. If it's an axios-like response with 'data'
    if (obj && Array.isArray(obj.data)) {
      return obj.data;
    }
  
    // 5. If it's a Test API response containing response.scriptResult as JSON string
    if (
      obj &&
      obj.response &&
      typeof obj.response.scriptResult === 'string'
    ) {
      try {
        const parsed = JSON.parse(obj.response.scriptResult);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // ignore parse error
      }
    }
  
    // 6. If response.scriptResult is already an array
    if (obj && obj.response && Array.isArray(obj.response.scriptResult)) {
      return obj.response.scriptResult;
    }
  
    throw new TypeError('Unable to extract array of objects from input');
  }
  
  module.exports = parseData;