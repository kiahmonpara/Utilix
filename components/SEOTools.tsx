// SEOTools.tsx
import React, { useState } from 'react';

const SEOTools: React.FC = () => {
  const [text, setText] = useState('');
  const [keyword, setKeyword] = useState('');
  const [density, setDensity] = useState<number | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const [urls, setUrls] = useState<string[]>([]);
  const [newUrl, setNewUrl] = useState('');

  const analyzeKeyword = () => {
    const words = text.toLowerCase().split(/\s+/).filter(Boolean);
    const count = words.filter((w) => w === keyword.toLowerCase()).length;
    const result = (count / words.length) * 100;
    setDensity(Number.isNaN(result) ? 0 : result);
  };

  const addUrl = () => {
    if (newUrl.trim()) {
      setUrls([...urls, newUrl]);
      setNewUrl('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-gray-900">
      <h1 className="text-3xl font-bold text-white mb-6">Analytics & SEO Tools</h1>

      {/* Keyword Analyzer */}
      <div className="bg-blue-100 p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-blue-700 mb-2">Keyword Analyzer</h2>
        <textarea
          rows={4}
          placeholder="Paste your content here..."
          className="w-full p-2 border rounded mb-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter keyword"
          className="p-2 border rounded mr-2"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={analyzeKeyword}
        >
          Analyze
        </button>
        {density !== null && (
          <p className="mt-2 text-blue-800">
            Keyword density: <strong>{density.toFixed(2)}%</strong>
          </p>
        )}
      </div>

      {/* Meta Tag Generator */}
      <div className="bg-green-100 p-4 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold text-green-700 mb-2">Meta Tag Generator</h2>
        <input
          type="text"
          placeholder="Page Title"
          className="w-full p-2 border rounded mb-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          rows={3}
          placeholder="Page Description"
          className="w-full p-2 border rounded mb-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="bg-white border rounded p-2 text-sm">
          <code>
            &lt;meta name="title" content="{title}" /&gt;
            <br />
            &lt;meta name="description" content="{description}" /&gt;
          </code>
        </div>
      </div>

      {/* Sitemap Generator */}
      <div className="bg-yellow-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-yellow-700 mb-2">Sitemap Generator</h2>
        <div className="flex mb-2">
          <input
            type="text"
            placeholder="https://example.com/page"
            className="p-2 border rounded w-full mr-2"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
          />
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded"
            onClick={addUrl}
          >
            Add
          </button>
        </div>
        <pre className="bg-white p-2 border rounded text-sm overflow-auto">
{`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
urls.map((url) => `  <url>\n    <loc>${url}</loc>\n  </url>`).join('\n') +
`\n</urlset>`}
        </pre>
      </div>
    </div>
  );
};

export default SEOTools;
