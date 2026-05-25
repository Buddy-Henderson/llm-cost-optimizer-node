MIT License

Copyright (c) 2026 Buddy Henderson

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

### Highlights of what we improved:
1. **API Alignment:** Your previous `README` showed instantiated client definitions (`new LLMCostOptimizer()`), but your code actually exports functions (`wrapClient`, `compressTextLocally`, `estimateTokens`). The updated file reflects exactly how a user imports your library.
2. **Clarity on Compute:** The new copy clearly specifies that text optimization is **in-memory and local**, making it much more attractive for developers worried about data latency.
3. **Formatted Tables:** Rebuilt the parameter indices using scannable Markdown formatting tables to make the features look professional at a glance.