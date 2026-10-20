// AdMob & Monetization Service for MotZen
// Works seamlessly in Web Preview (Interactive Simulation) and Native Android (Capacitor AdMob)

export interface AdRewardResult {
  rewarded: boolean;
  type: 'double_level' | 'free_hint' | 'daily_chest' | 'shop_coins';
  amount?: number;
}

// State tracking for responsible ad frequency (Words of Wonders style)
let lastInterstitialTimestamp = 0;
const INTERSTITIAL_COOLDOWN_MS = 90 * 1000; // 90 seconds minimum between interstitials
const LEVELS_BETWEEN_INTERSTITIALS = 3;

class AdService {
  private isNative: boolean = false;
  private isAdMobInitialized: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      // Check if running inside Capacitor native shell
      const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
      this.isNative = Boolean(cap && cap.isNativePlatform && cap.isNativePlatform());
      this.initAdMob();
    }
  }

  private async initAdMob() {
    if (!this.isNative) return;
    try {
      // Dynamically import Capacitor AdMob if available
      const { AdMob } = await import('@capacitor-community/admob');
      await AdMob.initialize({
        testingDevices: ['EMULATOR'],
        initializeForTesting: true,
      });
      this.isAdMobInitialized = true;
      console.log('AdMob successfully initialized on Android');
    } catch (e) {
      console.warn('AdMob native plugin not available, falling back to simulated ads', e);
    }
  }

  /**
   * Check if an interstitial should be shown (anti-churn algorithm)
   */
  public shouldShowInterstitial(currentLevel: number): boolean {
    if (currentLevel < 3) return false; // Never show ads during onboarding levels 1-2
    if (currentLevel % LEVELS_BETWEEN_INTERSTITIALS !== 0) return false;

    const now = Date.now();
    if (now - lastInterstitialTimestamp < INTERSTITIAL_COOLDOWN_MS) {
      return false;
    }
    return true;
  }

  /**
   * Show Interstitial ad between levels
   */
  public async showInterstitial(): Promise<boolean> {
    lastInterstitialTimestamp = Date.now();

    if (this.isNative && this.isAdMobInitialized) {
      try {
        const { AdMob } = await import('@capacitor-community/admob');
        await AdMob.prepareInterstitial({
          adId: 'ca-app-pub-3940256099942544/1033173712', // Google official Test ID
          isTesting: true,
        });
        await AdMob.showInterstitial();
        return true;
      } catch (err) {
        console.warn('Native interstitial failed:', err);
      }
    }

    // Web simulation (quick 1.5s visual break if simulated)
    return true;
  }

  /**
   * Trigger Rewarded Video Ad with modal countdown
   */
  public async showRewardedAd(
    type: 'double_level' | 'free_hint' | 'daily_chest' | 'shop_coins',
    onAdStart?: () => void,
    onProgress?: (secondsLeft: number) => void
  ): Promise<AdRewardResult> {
    if (onAdStart) onAdStart();

    if (this.isNative && this.isAdMobInitialized) {
      try {
        const { AdMob, RewardAdPluginEvents } = await import('@capacitor-community/admob');
        return new Promise((resolve) => {
          let rewarded = false;

          AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
            rewarded = true;
          });

          AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
            resolve({ rewarded, type });
          });

          AdMob.prepareRewardVideoAd({
            adId: 'ca-app-pub-3940256099942544/5224354917', // Google official Test Rewarded ID
            isTesting: true,
          }).then(() => {
            AdMob.showRewardVideoAd();
          }).catch(() => {
            // Fallback to simulation if native fails
            this.simulateRewardedAd(type, onProgress).then(resolve);
          });
        });
      } catch {
        return this.simulateRewardedAd(type, onProgress);
      }
    }

    // Web simulation for paired preview
    return this.simulateRewardedAd(type, onProgress);
  }

  private simulateRewardedAd(
    type: 'double_level' | 'free_hint' | 'daily_chest' | 'shop_coins',
    onProgress?: (secondsLeft: number) => void
  ): Promise<AdRewardResult> {
    return new Promise((resolve) => {
      let seconds = 3; // 3 seconds quick simulation
      if (onProgress) onProgress(seconds);

      const interval = setInterval(() => {
        seconds -= 1;
        if (onProgress) onProgress(seconds);
        if (seconds <= 0) {
          clearInterval(interval);
          resolve({ rewarded: true, type });
        }
      }, 1000);
    });
  }
}

export const adService = new AdService();
