/**
 * Main Layout Template
 */

export function getLayout(content: string, title: string = 'AuraLang'): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <script>
          tailwind.config = {
            theme: {
              extend: {
                colors: {
                  'aura-purple': '#8B5CF6',
                  'aura-blue': '#3B82F6',
                  'aura-cyan': '#06B6D4',
                  'quantum-glow': '#A855F7'
                }
              }
            }
          }
        </script>
    </head>
    <body class="bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 min-h-screen text-white">
        ${content}
    </body>
    </html>
  `
}
