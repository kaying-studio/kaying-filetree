import type { FileNode } from "./utils/tree-model.js";

/** 模拟项目文件树数据 */
export const demoTree: FileNode = {
  id: "root",
  name: "my-project",
  path: "/project",
  isDirectory: true,
  children: [
    {
      id: "src",
      name: "src",
      path: "/project/src",
      isDirectory: true,
      children: [
        {
          id: "components",
          name: "components",
          path: "/project/src/components",
          isDirectory: true,
          children: [
            {
              id: "src/components/Button.tsx",
              name: "Button.tsx",
              path: "/project/src/components/Button.tsx",
              isDirectory: false,
              gitStatus: "modified" as const,
            },
            {
              id: "src/components/Modal.tsx",
              name: "Modal.tsx",
              path: "/project/src/components/Modal.tsx",
              isDirectory: false,
            },
            {
              id: "src/components/Input.tsx",
              name: "Input.tsx",
              path: "/project/src/components/Input.tsx",
              isDirectory: false,
              gitStatus: "added" as const,
            },
          ],
        },
        {
          id: "utils",
          name: "utils",
          path: "/project/src/utils",
          isDirectory: true,
          children: [
            {
              id: "src/utils/helpers.ts",
              name: "helpers.ts",
              path: "/project/src/utils/helpers.ts",
              isDirectory: false,
            },
            {
              id: "src/utils/api.ts",
              name: "api.ts",
              path: "/project/src/utils/api.ts",
              isDirectory: false,
              gitStatus: "modified" as const,
            },
          ],
        },
        {
          id: "src/index.tsx",
          name: "index.tsx",
          path: "/project/src/index.tsx",
          isDirectory: false,
        },
        {
          id: "src/App.tsx",
          name: "App.tsx",
          path: "/project/src/App.tsx",
          isDirectory: false,
          gitStatus: "modified" as const,
        },
        {
          id: "src/styles.css",
          name: "styles.css",
          path: "/project/src/styles.css",
          isDirectory: false,
        },
      ],
    },
    {
      id: "public",
      name: "public",
      path: "/project/public",
      isDirectory: true,
      children: [
        {
          id: "public/index.html",
          name: "index.html",
          path: "/project/public/index.html",
          isDirectory: false,
        },
        {
          id: "public/favicon.svg",
          name: "favicon.svg",
          path: "/project/public/favicon.svg",
          isDirectory: false,
        },
        {
          id: "public/logo.png",
          name: "logo.png",
          path: "/project/public/logo.png",
          isDirectory: false,
        },
        {
          id: "public/hero.jpg",
          name: "hero.jpg",
          path: "/project/public/hero.jpg",
          isDirectory: false,
        },
        {
          id: "public/icon.webp",
          name: "icon.webp",
          path: "/project/public/icon.webp",
          isDirectory: false,
        },
      ],
    },
    {
      id: "tests",
      name: "tests",
      path: "/project/tests",
      isDirectory: true,
      children: [
        {
          id: "tests/Button.test.tsx",
          name: "Button.test.tsx",
          path: "/project/tests/Button.test.tsx",
          isDirectory: false,
          gitStatus: "untracked" as const,
        },
      ],
    },
    {
      id: "package.json",
      name: "package.json",
      path: "/project/package.json",
      isDirectory: false,
    },
    {
      id: "tsconfig.json",
      name: "tsconfig.json",
      path: "/project/tsconfig.json",
      isDirectory: false,
    },
    {
      id: "vite.config.ts",
      name: "vite.config.ts",
      path: "/project/vite.config.ts",
      isDirectory: false,
    },
    {
      id: "tailwind.config.ts",
      name: "tailwind.config.ts",
      path: "/project/tailwind.config.ts",
      isDirectory: false,
    },
    {
      id: ".gitignore",
      name: ".gitignore",
      path: "/project/.gitignore",
      isDirectory: false,
    },
    {
      id: "README.md",
      name: "README.md",
      path: "/project/README.md",
      isDirectory: false,
    },
    {
      id: "Dockerfile",
      name: "Dockerfile",
      path: "/project/Dockerfile",
      isDirectory: false,
    },
    {
      id: "go.mod",
      name: "go.mod",
      path: "/project/go.mod",
      isDirectory: false,
    },
    {
      id: "main.py",
      name: "main.py",
      path: "/project/main.py",
      isDirectory: false,
    },
    {
      id: "Cargo.toml",
      name: "Cargo.toml",
      path: "/project/Cargo.toml",
      isDirectory: false,
    },
    {
      id: "main.rs",
      name: "main.rs",
      path: "/project/main.rs",
      isDirectory: false,
    },
    {
      id: "data.json",
      name: "data.json",
      path: "/project/data.json",
      isDirectory: false,
    },
    {
      id: "config.yml",
      name: "config.yml",
      path: "/project/config.yml",
      isDirectory: false,
    },
  ],
};

/** 模拟文件内容 */
export const demoFileContents: Record<string, string> = {
  "Button.tsx": `import React from 'react';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  const baseClass = 'px-4 py-2 rounded font-medium transition-colors';
  const variantClass = variant === 'primary'
    ? 'bg-blue-500 text-white hover:bg-blue-600'
    : 'bg-gray-200 text-gray-800 hover:bg-gray-300';

  return (
    <button
      className={\`\${baseClass} \${variantClass}\`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
`,
  "Modal.tsx": `import React, { useState } from 'react';

export function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 max-w-md">
        {children}
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
}
`,
  "package.json": `{
  "name": "my-project",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "vite": "^5.4.0"
  }
}
`,
  "tsconfig.json": `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
`,
  "App.tsx": `import React, { useState, useEffect } from 'react';
import { Button } from './components/Button';
import { Modal } from './components/Modal';

export default function App() {
  const [count, setCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    console.log('App mounted');
  }, []);

  return (
    <div className="app">
      <h1>Counter: {count}</h1>
      <Button label="Increment" onClick={() => setCount(c => c + 1)} />
      <Button label="Show Modal" variant="secondary" onClick={() => setShowModal(true)} />
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <p>Current count: {count}</p>
        </Modal>
      )}
    </div>
  );
}
`,
  "styles.css": `:root {
  --primary-color: #3b82f6;
  --bg-color: #ffffff;
  --text-color: #1f2937;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
}

.app {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: var(--primary-color);
}
`,
  "helpers.ts": `export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function debounce<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
`,
  "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>My App</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/index.tsx"></script>
</body>
</html>
`,
  "README.md": `# My Project

A sample project demonstrating the **agent-file-tree** component.

> Web Component 文件树 + 代码预览组件，支持 Markdown 渲染预览。

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Features

- React 18
- TypeScript
- Vite
- Tailwind CSS

## Quick Example

\`\`\`ts
import { AgentFileExplorer } from '@kayingai/kaying-filetree';

const explorer = new AgentFileExplorer();
explorer.tree = projectTree;
explorer.initialFilePath = '/README.md';
\`\`\`

## Table

| Name    | Role     |
| ------- | -------- |
| Alice   | admin    |
| Bob     | user     |

## License

MIT
`,
  "Dockerfile": `FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`,
  "main.py": `import asyncio
from typing import List

async def fetch_data(url: str) -> dict:
    """Fetch data from a URL."""
    await asyncio.sleep(0.1)
    return {"status": "ok", "data": []}

def process_items(items: List[str]) -> List[str]:
    """Process a list of items."""
    return [item.upper() for item in items if item]

if __name__ == "__main__":
    result = asyncio.run(fetch_data("https://api.example.com"))
    print(result)
`,
  "main.rs": `use std::collections::HashMap;

fn main() {
    let mut scores: HashMap<String, i32> = HashMap::new();

    scores.insert(String::from("Alice"), 10);
    scores.insert(String::from("Bob"), 20);

    for (name, score) in &scores {
        println!("{}: {}", name, score);
    }

    let team_name = String::from("Alice");
    if let Some(score) = scores.get(&team_name) {
        println!("Score for {}: {}", team_name, score);
    }
}
`,
  "data.json": `{
  "users": [
    { "id": 1, "name": "Alice", "role": "admin" },
    { "id": 2, "name": "Bob", "role": "user" },
    { "id": 3, "name": "Charlie", "role": "user" }
  ],
  "settings": {
    "theme": "dark",
    "language": "zh-CN",
    "notifications": true
  }
}
`,
  "config.yml": `server:
  port: 3000
  host: 0.0.0.0

database:
  url: postgres://localhost:5432/mydb
  pool_size: 10

logging:
  level: debug
  format: json
`,
  "go.mod": `module github.com/example/my-project

go 1.22

require (
    github.com/gin-gonic/gin v1.9.1
    gorm.io/gorm v1.25.0
)
`,
  "vite.config.ts": `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom'],
        },
      },
    },
  },
});
`,
  "tailwind.config.ts": `import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,tsx,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
      },
    },
  },
  plugins: [],
} satisfies Config;
`,
  ".gitignore": `node_modules/
dist/
.env
.env.local
*.log
.DS_Store
.vscode/
coverage/
`,
  "favicon.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
  <circle cx="8" cy="8" r="6" fill="#3b82f6"/>
</svg>
`,
  "logo.png": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 60'%3E%3Crect width='200' height='60' rx='8' fill='%231e1e1e'/%3E%3Ctext x='100' y='38' font-size='24' font-family='sans-serif' fill='%234a9eff' text-anchor='middle' font-weight='bold'%3Emy-project%3C/text%3E%3C/svg%3E",
  "hero.jpg": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 300'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23667eea'/%3E%3Cstop offset='1' stop-color='%23764ba2'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='300' fill='url(%23g)'/%3E%3Ctext x='400' y='160' font-size='32' font-family='sans-serif' fill='white' text-anchor='middle'%3EHero Banner%3C/text%3E%3C/svg%3E",
  "icon.webp": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='12' fill='%2338bdf8'/%3E%3Cpath d='M32 18l14 8v16l-14 8-14-8V26z' fill='white' opacity='0.9'/%3E%3C/svg%3E",
  "Input.tsx": `import React from 'react';

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'password' | 'email';
}

export function Input({ value, onChange, placeholder, type = 'text' }: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="border rounded px-3 py-2 w-full"
    />
  );
}
`,
  "api.ts": `const API_BASE = '/api/v1';

export async function fetchUser(id: number): Promise<User> {
  const res = await fetch(\`\${API_BASE}/users/\${id}\`);
  if (!res.ok) throw new Error('Failed to fetch user');
  return res.json();
}

export async function updateUser(id: number, data: Partial<User>): Promise<User> {
  const res = await fetch(\`\${API_BASE}/users/\${id}\`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update user');
  return res.json();
}

export interface User {
  id: number;
  name: string;
  email: string;
}
`,
  "index.tsx": `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`,
  "Cargo.toml": `[package]
name = "my-project"
version = "0.1.0"
edition = "2021"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1.0", features = ["full"] }
axum = "0.7"

[dev-dependencies]
tower = "0.4"
`,
  "Button.test.tsx": `import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../src/components/Button';

describe('Button', () => {
  it('renders the label', () => {
    render(<Button label="Click me" />);
    expect(screen.getByText('Click me')).toBeDefined();
  });

  it('calls onClick when clicked', () => {
    let clicked = false;
    render(<Button label="Click" onClick={() => clicked = true} />);
    screen.getByText('Click').click();
    expect(clicked).toBe(true);
  });
});
`,
};
