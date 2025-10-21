import { getLayout } from './layout'
import { getHeader } from './header'

export function getFeaturesPage(): string {
  const content = `
    ${getHeader(false)}
    
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        🌟 105+ Features - World's Best Free Web IDE
      </h1>
      <p class="text-center text-gray-600 mb-8">
        A comprehensive collection of professional-grade features, completely free forever
      </p>

      <!-- Phase 1: Core Authentication & Security -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4 flex items-center">
          <span class="mr-2">🔐</span> Phase 1: Core Authentication & Security (10 Features)
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">1. Multi-Provider Authentication</h3>
            <p class="text-gray-600 text-sm">Google, GitHub, GitLab, Bitbucket OAuth + email/password</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">2. Social Login Integration</h3>
            <p class="text-gray-600 text-sm">Facebook, Twitter, LinkedIn, Discord authentication</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">3. Two-Factor Authentication</h3>
            <p class="text-gray-600 text-sm">TOTP with QR codes and backup codes</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">4. Biometric Authentication</h3>
            <p class="text-gray-600 text-sm">WebAuthn fingerprint and face recognition</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">5. Role-Based Access Control</h3>
            <p class="text-gray-600 text-sm">Granular permissions and custom roles</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">6. SSO Integration</h3>
            <p class="text-gray-600 text-sm">SAML 2.0 and OAuth 2.0 enterprise SSO</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">7. Session Management</h3>
            <p class="text-gray-600 text-sm">Multiple devices with activity monitoring</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">8. Password Security</h3>
            <p class="text-gray-600 text-sm">Strength checker, reset, and passkey support</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">9. Account Recovery</h3>
            <p class="text-gray-600 text-sm">Multiple recovery methods and verification</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">10. Privacy Controls</h3>
            <p class="text-gray-600 text-sm">GDPR compliance with data export/deletion</p>
          </div>
        </div>
      </div>

      <!-- Phase 2: Project Management & Collaboration -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4 flex items-center">
          <span class="mr-2">📁</span> Phase 2: Project Management & Collaboration (10 Features)
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">11. Unlimited Projects</h3>
            <p class="text-gray-600 text-sm">Create unlimited projects with templates</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">12. Project Workspaces</h3>
            <p class="text-gray-600 text-sm">Organize projects by teams or categories</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">13. Version Control</h3>
            <p class="text-gray-600 text-sm">Built-in Git with visual diff and merge tools</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">14. Real-time Collaboration</h3>
            <p class="text-gray-600 text-sm">Live coding with cursors and video chat</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">15. Project Sharing</h3>
            <p class="text-gray-600 text-sm">Public/private sharing with embed codes</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">16. Team Management</h3>
            <p class="text-gray-600 text-sm">Invite members with role-based permissions</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">17. Project Analytics</h3>
            <p class="text-gray-600 text-sm">Code stats, contributor insights, and trends</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">18. Comments & Reviews</h3>
            <p class="text-gray-600 text-sm">Inline code comments and pull request reviews</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">19. Issue Tracking</h3>
            <p class="text-gray-600 text-sm">Built-in bug tracking and task management</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">20. Project Templates</h3>
            <p class="text-gray-600 text-sm">100+ templates for all frameworks</p>
          </div>
        </div>
      </div>

      <!-- Phase 3: AI Code Intelligence -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold mb-4 flex items-center">
          <span class="mr-2">🤖</span> Phase 3: AI Code Intelligence (15 Features)
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">21. AI Code Completion</h3>
            <p class="text-gray-600 text-sm">Context-aware suggestions with multi-line</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">22. AI Chat Assistant</h3>
            <p class="text-gray-600 text-sm">GPT-4 powered coding help</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">23. Code Explanation</h3>
            <p class="text-gray-600 text-sm">Natural language explanations</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">24. Code Generation</h3>
            <p class="text-gray-600 text-sm">Generate from natural language descriptions</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">25. Bug Detection</h3>
            <p class="text-gray-600 text-sm">AI-powered bug finding with fix suggestions</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">26. Code Refactoring</h3>
            <p class="text-gray-600 text-sm">Intelligent refactoring suggestions</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">27. Documentation Generator</h3>
            <p class="text-gray-600 text-sm">Auto-generate comprehensive docs</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">28. Test Generation</h3>
            <p class="text-gray-600 text-sm">AI-generated unit and integration tests</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">29. Code Translation</h3>
            <p class="text-gray-600 text-sm">Convert between programming languages</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">30. Performance Analysis</h3>
            <p class="text-gray-600 text-sm">Identify bottlenecks and optimization</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">31. Security Scanning</h3>
            <p class="text-gray-600 text-sm">Vulnerability detection and fixes</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">32. Code Review AI</h3>
            <p class="text-gray-600 text-sm">Automated code review with suggestions</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">33. Semantic Search</h3>
            <p class="text-gray-600 text-sm">Find code by meaning, not just keywords</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">34. Code Similarity Detection</h3>
            <p class="text-gray-600 text-sm">Find duplicate and similar code patterns</p>
          </div>
          <div class="p-4 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 class="font-semibold text-lg mb-2">35. AI Pair Programming</h3>
            <p class="text-gray-600 text-sm">Real-time AI coding partner</p>
          </div>
        </div>
      </div>

      <!-- Phases 4-10 Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="p-6 border-2 border-blue-500 rounded-lg bg-blue-50">
          <h3 class="text-xl font-bold mb-2">📊 Phase 4: Visualization</h3>
          <p class="text-gray-700 mb-2">10 visualization features</p>
          <ul class="text-sm text-gray-600 space-y-1">
            <li>• Interactive charts & graphs</li>
            <li>• Code metrics dashboard</li>
            <li>• 3D dependency graphs</li>
            <li>• And 7 more...</li>
          </ul>
        </div>

        <div class="p-6 border-2 border-green-500 rounded-lg bg-green-50">
          <h3 class="text-xl font-bold mb-2">🎨 Phase 5: Marketplace</h3>
          <p class="text-gray-700 mb-2">10 marketplace features</p>
          <ul class="text-sm text-gray-600 space-y-1">
            <li>• Plugin marketplace</li>
            <li>• Theme customization</li>
            <li>• Extension API</li>
            <li>• And 7 more...</li>
          </ul>
        </div>

        <div class="p-6 border-2 border-purple-500 rounded-lg bg-purple-50">
          <h3 class="text-xl font-bold mb-2">☁️ Phase 6: Cloud Deploy</h3>
          <p class="text-gray-700 mb-2">10 deployment features</p>
          <ul class="text-sm text-gray-600 space-y-1">
            <li>• One-click deployments</li>
            <li>• CI/CD pipelines</li>
            <li>• Multi-cloud support</li>
            <li>• And 7 more...</li>
          </ul>
        </div>

        <div class="p-6 border-2 border-yellow-500 rounded-lg bg-yellow-50">
          <h3 class="text-xl font-bold mb-2">📱 Phase 7: Mobile & PWA</h3>
          <p class="text-gray-700 mb-2">10 mobile features</p>
          <ul class="text-sm text-gray-600 space-y-1">
            <li>• Progressive Web App</li>
            <li>• Mobile-optimized UI</li>
            <li>• Offline mode</li>
            <li>• And 7 more...</li>
          </ul>
        </div>

        <div class="p-6 border-2 border-red-500 rounded-lg bg-red-50">
          <h3 class="text-xl font-bold mb-2">🏢 Phase 8: Enterprise</h3>
          <p class="text-gray-700 mb-2">10 enterprise features</p>
          <ul class="text-sm text-gray-600 space-y-1">
            <li>• Team workspaces</li>
            <li>• Audit logging</li>
            <li>• Compliance tools</li>
            <li>• And 7 more...</li>
          </ul>
        </div>

        <div class="p-6 border-2 border-indigo-500 rounded-lg bg-indigo-50">
          <h3 class="text-xl font-bold mb-2">🧠 Phase 9: Advanced AI</h3>
          <p class="text-gray-700 mb-2">10 advanced AI features</p>
          <ul class="text-sm text-gray-600 space-y-1">
            <li>• Custom AI models</li>
            <li>• ML integration</li>
            <li>• Neural code search</li>
            <li>• And 7 more...</li>
          </ul>
        </div>
      </div>

      <!-- Phase 10 Highlight -->
      <div class="p-8 border-4 border-gradient rounded-lg bg-gradient-to-r from-purple-100 to-blue-100 mb-8">
        <h2 class="text-3xl font-bold mb-4 flex items-center justify-center">
          <span class="mr-2">🚀</span> Phase 10: Experimental & Future Tech (20 Features)
        </h2>
        <p class="text-center text-gray-700 mb-6">
          Cutting-edge features that push the boundaries of web development
        </p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="text-center p-4 bg-white rounded-lg shadow">
            <div class="text-2xl mb-2">🌐</div>
            <p class="font-semibold">WebAssembly</p>
          </div>
          <div class="text-center p-4 bg-white rounded-lg shadow">
            <div class="text-2xl mb-2">🔗</div>
            <p class="font-semibold">Blockchain</p>
          </div>
          <div class="text-center p-4 bg-white rounded-lg shadow">
            <div class="text-2xl mb-2">🎮</div>
            <p class="font-semibold">Metaverse</p>
          </div>
          <div class="text-center p-4 bg-white rounded-lg shadow">
            <div class="text-2xl mb-2">🔮</div>
            <p class="font-semibold">Quantum</p>
          </div>
        </div>
      </div>

      <!-- Stats Summary -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="text-center p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg">
          <div class="text-4xl font-bold">105+</div>
          <div class="text-sm">Total Features</div>
        </div>
        <div class="text-center p-6 bg-gradient-to-br from-green-500 to-teal-600 text-white rounded-lg">
          <div class="text-4xl font-bold">10</div>
          <div class="text-sm">Service Layers</div>
        </div>
        <div class="text-center p-6 bg-gradient-to-br from-yellow-500 to-orange-600 text-white rounded-lg">
          <div class="text-4xl font-bold">50+</div>
          <div class="text-sm">API Endpoints</div>
        </div>
        <div class="text-center p-6 bg-gradient-to-br from-red-500 to-pink-600 text-white rounded-lg">
          <div class="text-4xl font-bold">100%</div>
          <div class="text-sm">Free Forever</div>
        </div>
      </div>

      <!-- CTA -->
      <div class="text-center p-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg">
        <h2 class="text-3xl font-bold mb-4">Ready to Experience the Best?</h2>
        <p class="text-xl mb-6">All 105+ features are available right now, completely free!</p>
        <a href="/" class="inline-block px-8 py-3 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
          Start Coding Now →
        </a>
      </div>
    </div>
  `

  return getLayout(content, 'All Features - AuraLang')
}
