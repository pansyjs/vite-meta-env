/**
 * 环境变量表达式是静态转换的，必须使用完整的静态字符串来引用它们。
 * 以下方式获取不到
 *   import.meta.env
 *   import.meta.env['FOO']
 */
const envMap: Record<string, string> = {
  S_API_HOST: import.meta.env.S_API_HOST,
};

export const getEnvValue = (key: string): string => {
  if (import.meta.env.DEV) {
    return envMap[key];
  }

  try {
    return window.import_meta_env[key] || envMap[key];
  } catch (error) {
    return '';
  }
};
