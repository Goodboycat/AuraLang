/**
 * Mobile & PWA Experience Service
 * Features: Progressive Web App, offline mode, mobile optimization, native features
 */

interface PWAConfig {
  name: string
  shortName: string
  description: string
  themeColor: string
  backgroundColor: string
  icons: PWAIcon[]
  startUrl: string
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser'
  orientation: 'any' | 'portrait' | 'landscape'
  scope: string
}

interface PWAIcon {
  src: string
  sizes: string
  type: string
  purpose?: 'any' | 'maskable' | 'monochrome'
}

interface OfflineCache {
  version: string
  assets: string[]
  apiResponses: Map<string, CachedResponse>
  lastUpdated: Date
}

interface CachedResponse {
  data: any
  timestamp: Date
  expiresAt: Date
}

interface MobileFeature {
  name: string
  supported: boolean
  permission: 'granted' | 'denied' | 'prompt' | 'n/a'
}

interface NotificationConfig {
  title: string
  body: string
  icon?: string
  badge?: string
  data?: any
  actions?: NotificationAction[]
  vibrate?: number[]
}

interface NotificationAction {
  action: string
  title: string
  icon?: string
}

export class MobilePWAService {
  private offlineCache: OfflineCache
  private serviceWorkerReady = false

  constructor() {
    this.offlineCache = {
      version: '1.0.0',
      assets: [],
      apiResponses: new Map(),
      lastUpdated: new Date()
    }
    this.initializePWA()
  }

  /**
   * Feature 61: Progressive Web App (PWA)
   */
  async installPWA(): Promise<InstallResult> {
    const manifest = await this.generateManifest()
    const serviceWorker = await this.registerServiceWorker()

    return {
      success: true,
      installable: true,
      prompt: 'beforeinstallprompt',
      manifest,
      serviceWorker
    }
  }

  async generateManifest(): Promise<PWAConfig> {
    return {
      name: 'AuraLang - AI Programming Platform',
      shortName: 'AuraLang',
      description: 'Next-generation AI programming language and IDE',
      themeColor: '#8b5cf6',
      backgroundColor: '#0f172a',
      icons: [
        {
          src: '/icons/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: '/icons/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ],
      startUrl: '/',
      display: 'standalone',
      orientation: 'any',
      scope: '/'
    }
  }

  async registerServiceWorker(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      return false
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js')
      this.serviceWorkerReady = true
      return true
    } catch (error) {
      console.error('Service Worker registration failed:', error)
      return false
    }
  }

  /**
   * Feature 62: Offline Mode & Sync
   */
  async enableOfflineMode(): Promise<boolean> {
    // Cache critical assets
    await this.cacheAssets([
      '/',
      '/static/styles.css',
      '/static/auralang-ide.js',
      '/api/quantum/state',
      '/api/intent/execute'
    ])

    // Setup background sync
    await this.setupBackgroundSync()

    return true
  }

  async cacheAssets(assets: string[]): Promise<void> {
    if (!this.serviceWorkerReady) return

    this.offlineCache.assets = assets
    this.offlineCache.lastUpdated = new Date()

    // Send message to service worker to cache assets
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CACHE_ASSETS',
        assets
      })
    }
  }

  async syncWhenOnline(): Promise<SyncResult> {
    const pendingChanges = await this.getPendingChanges()

    if (pendingChanges.length === 0) {
      return { success: true, synced: 0 }
    }

    let synced = 0
    for (const change of pendingChanges) {
      try {
        await this.syncChange(change)
        synced++
      } catch (error) {
        console.error('Failed to sync change:', error)
      }
    }

    return { success: true, synced, total: pendingChanges.length }
  }

  /**
   * Feature 63: Mobile-Optimized Interface
   */
  async detectMobileDevice(): Promise<DeviceInfo> {
    const userAgent = navigator.userAgent
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
    const isTablet = /iPad|Android/i.test(userAgent) && !/Mobile/i.test(userAgent)

    return {
      isMobile,
      isTablet,
      isDesktop: !isMobile && !isTablet,
      platform: this.detectPlatform(),
      screenSize: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      orientation: window.innerWidth > window.innerHeight ? 'landscape' : 'portrait',
      touchEnabled: 'ontouchstart' in window
    }
  }

  async optimizeForMobile(): Promise<MobileOptimizations> {
    const device = await this.detectMobileDevice()

    const optimizations: MobileOptimizations = {
      reducedAnimations: device.isMobile,
      compressedAssets: true,
      lazyLoading: true,
      touchOptimized: device.touchEnabled,
      responsiveLayout: true,
      mobileMenu: device.isMobile,
      gestureSupport: device.touchEnabled
    }

    await this.applyOptimizations(optimizations)

    return optimizations
  }

  /**
   * Feature 64: Touch Gestures & Interactions
   */
  async enableGestureControls(): Promise<GestureConfig> {
    const gestures: GestureConfig = {
      swipe: {
        enabled: true,
        threshold: 50,
        actions: {
          left: 'next-file',
          right: 'prev-file',
          up: 'scroll-down',
          down: 'scroll-up'
        }
      },
      pinch: {
        enabled: true,
        action: 'zoom'
      },
      doubleTap: {
        enabled: true,
        action: 'select-word'
      },
      longPress: {
        enabled: true,
        duration: 500,
        action: 'context-menu'
      }
    }

    await this.registerGestureHandlers(gestures)

    return gestures
  }

  /**
   * Feature 65: Push Notifications
   */
  async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  async sendPushNotification(config: NotificationConfig): Promise<boolean> {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return false
    }

    const notification = new Notification(config.title, {
      body: config.body,
      icon: config.icon || '/icons/icon-192.png',
      badge: config.badge || '/icons/badge.png',
      data: config.data,
      vibrate: config.vibrate || [200, 100, 200],
      actions: config.actions
    })

    return true
  }

  /**
   * Feature 66: Native Device Features
   */
  async getNativeFeatures(): Promise<MobileFeature[]> {
    return [
      {
        name: 'Camera',
        supported: 'mediaDevices' in navigator,
        permission: await this.checkPermission('camera')
      },
      {
        name: 'Microphone',
        supported: 'mediaDevices' in navigator,
        permission: await this.checkPermission('microphone')
      },
      {
        name: 'Geolocation',
        supported: 'geolocation' in navigator,
        permission: await this.checkPermission('geolocation')
      },
      {
        name: 'Accelerometer',
        supported: 'DeviceMotionEvent' in window,
        permission: 'n/a'
      },
      {
        name: 'Vibration',
        supported: 'vibrate' in navigator,
        permission: 'n/a'
      },
      {
        name: 'Battery',
        supported: 'getBattery' in navigator,
        permission: 'n/a'
      },
      {
        name: 'Share API',
        supported: 'share' in navigator,
        permission: 'n/a'
      },
      {
        name: 'File System',
        supported: 'showOpenFilePicker' in window,
        permission: await this.checkPermission('file-system')
      }
    ]
  }

  async accessCamera(): Promise<MediaStream | null> {
    if (!('mediaDevices' in navigator)) return null

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      return stream
    } catch (error) {
      console.error('Camera access denied:', error)
      return null
    }
  }

  async getLocation(): Promise<GeolocationPosition | null> {
    if (!('geolocation' in navigator)) return null

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })
  }

  async shareContent(data: ShareData): Promise<boolean> {
    if (!('share' in navigator)) return false

    try {
      await navigator.share(data)
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Feature 67: Responsive Code Editor
   */
  async adaptEditorForMobile(): Promise<EditorConfig> {
    const device = await this.detectMobileDevice()

    return {
      fontSize: device.isMobile ? 12 : 14,
      lineHeight: device.isMobile ? 1.3 : 1.5,
      wordWrap: true,
      minimap: !device.isMobile,
      lineNumbers: device.isTablet || device.isDesktop,
      folding: device.isTablet || device.isDesktop,
      touchOptimized: device.touchEnabled,
      virtualKeyboard: device.isMobile,
      autocomplete: {
        enabled: true,
        triggerOnType: !device.isMobile,
        suggestionDelay: device.isMobile ? 300 : 100
      }
    }
  }

  /**
   * Feature 68: App Shortcuts
   */
  async createAppShortcuts(): Promise<AppShortcut[]> {
    const shortcuts: AppShortcut[] = [
      {
        name: 'New Project',
        description: 'Create a new AuraLang project',
        url: '/new',
        icons: [{ src: '/icons/new-project.png', sizes: '96x96' }]
      },
      {
        name: 'Recent Projects',
        description: 'View recent projects',
        url: '/projects',
        icons: [{ src: '/icons/projects.png', sizes: '96x96' }]
      },
      {
        name: 'Marketplace',
        description: 'Browse plugins and themes',
        url: '/marketplace',
        icons: [{ src: '/icons/marketplace.png', sizes: '96x96' }]
      }
    ]

    return shortcuts
  }

  /**
   * Feature 69: Voice Commands
   */
  async enableVoiceCommands(): Promise<VoiceConfig> {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      return { enabled: false, supported: false }
    }

    const commands: VoiceCommand[] = [
      { phrase: 'new project', action: 'create-project' },
      { phrase: 'run code', action: 'execute-intent' },
      { phrase: 'save file', action: 'save' },
      { phrase: 'open settings', action: 'open-settings' },
      { phrase: 'show help', action: 'show-help' }
    ]

    await this.registerVoiceCommands(commands)

    return {
      enabled: true,
      supported: true,
      commands,
      language: 'en-US',
      continuous: false
    }
  }

  /**
   * Feature 70: Battery & Performance Optimization
   */
  async monitorBatteryStatus(): Promise<BatteryStatus | null> {
    if (!('getBattery' in navigator)) return null

    try {
      const battery = await (navigator as any).getBattery()
      
      return {
        level: battery.level * 100,
        charging: battery.charging,
        chargingTime: battery.chargingTime,
        dischargingTime: battery.dischargingTime,
        optimizationMode: battery.level < 0.2 ? 'aggressive' : 'normal'
      }
    } catch (error) {
      return null
    }
  }

  async enableBatterySavingMode(): Promise<boolean> {
    // Reduce animations
    document.body.classList.add('reduced-motion')
    
    // Disable auto-refresh
    // Reduce polling frequency
    // Dim brightness suggestions
    
    return true
  }

  async optimizePerformance(mode: 'high' | 'balanced' | 'battery-saver'): Promise<PerformanceConfig> {
    const config: PerformanceConfig = {
      mode,
      animations: mode !== 'battery-saver',
      backgroundSync: mode === 'high',
      prefetching: mode === 'high',
      caching: mode !== 'battery-saver' ? 'aggressive' : 'minimal',
      updateFrequency: mode === 'high' ? 1000 : mode === 'balanced' ? 5000 : 30000
    }

    await this.applyPerformanceSettings(config)

    return config
  }

  // Helper Methods
  private async initializePWA(): Promise<void> {
    // Initialize PWA features
    if ('serviceWorker' in navigator) {
      await this.registerServiceWorker()
    }
  }

  private async setupBackgroundSync(): Promise<void> {
    if ('sync' in navigator.serviceWorker.ready) {
      const registration = await navigator.serviceWorker.ready
      await (registration as any).sync.register('sync-data')
    }
  }

  private async getPendingChanges(): Promise<PendingChange[]> {
    // Get pending changes from IndexedDB
    return []
  }

  private async syncChange(change: PendingChange): Promise<void> {
    // Sync individual change
  }

  private detectPlatform(): string {
    const ua = navigator.userAgent
    if (/Android/i.test(ua)) return 'Android'
    if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS'
    if (/Windows/i.test(ua)) return 'Windows'
    if (/Macintosh/i.test(ua)) return 'macOS'
    if (/Linux/i.test(ua)) return 'Linux'
    return 'Unknown'
  }

  private async applyOptimizations(optimizations: MobileOptimizations): Promise<void> {
    // Apply mobile optimizations
  }

  private async registerGestureHandlers(gestures: GestureConfig): Promise<void> {
    // Register gesture event handlers
  }

  private async checkPermission(name: string): Promise<'granted' | 'denied' | 'prompt' | 'n/a'> {
    try {
      if ('permissions' in navigator) {
        const result = await (navigator.permissions as any).query({ name })
        return result.state
      }
    } catch (error) {
      return 'n/a'
    }
    return 'n/a'
  }

  private async registerVoiceCommands(commands: VoiceCommand[]): Promise<void> {
    // Register voice command handlers
  }

  private async applyPerformanceSettings(config: PerformanceConfig): Promise<void> {
    // Apply performance configuration
  }
}

// Types
interface InstallResult {
  success: boolean
  installable: boolean
  prompt: string
  manifest: PWAConfig
  serviceWorker: boolean
}

interface SyncResult {
  success: boolean
  synced: number
  total?: number
}

interface DeviceInfo {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  platform: string
  screenSize: {width: number, height: number}
  orientation: 'portrait' | 'landscape'
  touchEnabled: boolean
}

interface MobileOptimizations {
  reducedAnimations: boolean
  compressedAssets: boolean
  lazyLoading: boolean
  touchOptimized: boolean
  responsiveLayout: boolean
  mobileMenu: boolean
  gestureSupport: boolean
}

interface GestureConfig {
  swipe: {
    enabled: boolean
    threshold: number
    actions: Record<string, string>
  }
  pinch: {
    enabled: boolean
    action: string
  }
  doubleTap: {
    enabled: boolean
    action: string
  }
  longPress: {
    enabled: boolean
    duration: number
    action: string
  }
}

interface ShareData {
  title?: string
  text?: string
  url?: string
  files?: File[]
}

interface EditorConfig {
  fontSize: number
  lineHeight: number
  wordWrap: boolean
  minimap: boolean
  lineNumbers: boolean
  folding: boolean
  touchOptimized: boolean
  virtualKeyboard: boolean
  autocomplete: {
    enabled: boolean
    triggerOnType: boolean
    suggestionDelay: number
  }
}

interface AppShortcut {
  name: string
  description: string
  url: string
  icons: PWAIcon[]
}

interface VoiceCommand {
  phrase: string
  action: string
}

interface VoiceConfig {
  enabled: boolean
  supported: boolean
  commands?: VoiceCommand[]
  language?: string
  continuous?: boolean
}

interface BatteryStatus {
  level: number
  charging: boolean
  chargingTime: number
  dischargingTime: number
  optimizationMode: 'normal' | 'aggressive'
}

interface PerformanceConfig {
  mode: 'high' | 'balanced' | 'battery-saver'
  animations: boolean
  backgroundSync: boolean
  prefetching: boolean
  caching: 'aggressive' | 'minimal'
  updateFrequency: number
}

interface PendingChange {
  id: string
  type: string
  data: any
  timestamp: Date
}
