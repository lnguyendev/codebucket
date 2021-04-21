import * as esbuild from 'esbuild-wasm';
import ReactDOM from 'react-dom';
import { useEffect, useState, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

export const App = () => {
  const ref = useRef<any>();
  const iframe = useRef<any>();
  const [input, setInput] = useState('');

  useEffect(() => {
    startService();
  }, []);

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm'
    });
  }

  const onClick = async () => {
    if (!ref.current) return;

    iframe.current.srcdoc = html;

    const result = await ref.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [
        unpkgPathPlugin(),
        fetchPlugin(input)
      ],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window'
      }
    });

    // setCode(result.outputFiles[0].text);
    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*');
  }

  const html = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          window.addEventListener('message', (event) => {
            try {
              eval(event.data);
            } catch (e) {
              document.getElementById('root').innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + e + '</div>';
              console.error(e);
            }
          }, false);
        </script>
      </body>
    </html>
  `;

  return (
    <div>
      <textarea onChange={e => setInput(e.target.value)} value={input}></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <iframe title="preview" ref={iframe} sandbox="allow-scripts" srcDoc={html}></iframe>
    </div>
  )
};

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
