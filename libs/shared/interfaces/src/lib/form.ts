export interface FormItem {
  name: string;
  type: string;
  label: string;
  invalid: string;
  placeholder: string;
  icon?: string;
  validators?: Record<string, string | boolean | number>;
}
