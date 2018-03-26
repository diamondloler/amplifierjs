# amplifierjs
amplifier is an zoom-in and zoom-out library. It 's very light weight, can easily bind the img tag implement zoom-in and zoom-out , no matter where it is.
<h2>Live Demo</h2>
<p>See it in action, <a href="https://diamondloler.github.io/amplifierjs/src/index">check out the demo page</a></p>
<p>To view demo examples locally clone the repo and open the index page, run <code>npm run build</code> can bundle the scource</p>
<h2>Expected to work</h2>
<p>IE10+...</p>
<h2>Usage</h2>
<p>Include with a script tag, or install with your package manager of choice (Bower/Component/npm).</p>
<div class="highlight highlight-source-js"><pre><span class="pl-smi">amplifier</span>(selector, myImageClassName)</pre></div>
<p>Now, amplifier not yet implement zoom-in or zoom-out, it will output a public apis, you can suitably use apis to implement zoom-in or zoom-out that you want</p>
<h2>API Reference</h2>
<ul>
  <li>
    <h4>amplifier(selector, myImageClassName).init(options)</h4>
    <p>Takes an options object. Available options (all options take valid CSS values):</p>
   <ul>
<li><code>transitionDuration</code> - default: <code>'.4s'</code></li>
<li><code>transitionTimingFunction</code> - default: <code>'cubic-bezier(.4,0,0,1)'</code></li>
<li><code>bgColor</code> - default: <code>'rgba(255, 255, 255, 0.8)'</code></li>
<li><code>onOpen</code> - a callback function that will be called when a target is zoomed in and transition has ended. It will get the target element as the argument.</li>
<li><code>onClose</code> - same as <code>onOpen</code>, except fired when zoomed out.</li>
<li><code>onBeforeOpen</code> - a callback function, that will be called before zoom-in.</li>
<li><code>onBeforeClose</code> - a callback function, that will be called before zoom-out.</li>
</ul>
  </li>
</ul>


