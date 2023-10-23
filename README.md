<h1 align="center">
  多环境适配示例
</h1>

## 目标

- 支持多环境适配
- 支持产物与环境无关

## 环境变量加载

> Vite [环境变量和模式](https://cn.vitejs.dev/guide/env-and-mode.html#env-files)

通过 `.env` 及 `.env.loacl` 解决本地开发及线上环境变量不一致问题 

```sh
.env                # 所有情况下都会加载
.env.local          # 所有情况下都会加载，但会被 git 忽略
.env.[mode]         # 只在指定模式下加载
.env.[mode].local   # 只在指定模式下加载，但会被 git 忽略
```

多环境可通过 `mode` 解决多环境适配问题

## Vite 服务

可通过以下方式获取环境变量

```ts
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const envPrefix = ['VITE_', 'S_'];

export default defineConfig(({ mode }) => {
  // 获取环境变量
  const env = loadEnv(mode, __dirname, envPrefix);

  return {
    envPrefix,
    plugins: [
      react()
    ],
  }
})
```

## 前端 SPA 环境变量

借助 [import-meta-env](https://github.com/iendeavor/import-meta-env) 提供的能力使构建产物与环境无关

具体实现如下

1. 添加环境变量替换入口

```html
<!-- index.html -->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>多环境适配示例</title>
    <!-- 新增 -->
    <script>
      globalThis.import_meta_env = JSON.parse('"import_meta_env_placeholder"')
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

2. 添加 `.env.example`

```sh
# .env.example
S_API_HOST=https://xx.com
```

3. 添加替换脚本

```json
{
  "scripts": {
    "deploy:env": "S_API_HOST=https://test.xx.com import-meta-env -x .env.example -p dist/index.html"
  },
  "devDependencies": {
    "@import-meta-env/cli": "^0.6.7"
  }
}
```

4. 添加获取环境变量工具方法

```ts
// src/utils/env.ts
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
```