
export interface ValidationRule {
    field: string;
    type: 'min' | 'max' | 'required' | 'pattern' | 'custom';
    value?: number | string | RegExp;
    message: string;
  }
  
  export interface ValidationRulesResponse {
    rules: ValidationRule[];
  }