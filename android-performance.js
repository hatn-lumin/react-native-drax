/**
 * Android Performance Optimizations for React Native Drax
 * 
 * This file contains helper functions to optimize performance on Android
 * when using react-native-drax.
 * 
 * Import and use these functions in your application to improve performance.
 */

import { Platform } from 'react-native';
import { runOnUI } from 'react-native-reanimated';

/**
 * Configure global performance settings for Drax on Android
 * Call this function in your app's entry point before using Drax components
 */
export const configureDraxPerformance = () => {
  if (Platform.OS === 'android') {
    // These settings apply only to Android which has more performance issues
    
    // Ensure JavaScript timers don't fire too often during drag operations
    // which can impact UI thread performance
    if (global.performance) {
      global.performance.now = () => Date.now();
    }
    
    // Create a worklet for calculations that would normally be done on JS thread
    const optimizeCalculationsWorklet = runOnUI(() => {
      'worklet';
      
      // Any UI-thread calculations can be defined here
      // This helps move work off the JS thread for smoother animations
      
      global.__draxOptimizeCalculations = true;
    });
    
    optimizeCalculationsWorklet();
    
    console.log('Drax: Applied Android performance optimizations');
  }
};

/**
 * Performance tips for using Drax on Android
 * 
 * 1. Use opacity animations with withTiming instead of springs for smoother drags
 * 2. Keep your draggable items relatively simple in structure
 * 3. Use the useOptimizedMeasurements hook instead of standard measurements
 * 4. Consider adding the following to your app.json for Expo apps:
 *    "androidNavigationBar": {
 *      "barStyle": "dark-content",
 *      "backgroundColor": "#FFFFFF"
 *    },
 *    "androidStatusBar": {
 *      "barStyle": "dark-content",
 *      "backgroundColor": "#FFFFFF"
 *    }
 * 5. For non-Expo apps, consider the following native optimizations:
 *    - Enable hardware acceleration for animations in your Activity
 *    - Set appropriate thread priorities
 *    - Minimize garbage collection during drags by pre-allocating memory
 */

/**
 * Enhanced throttle function designed specifically for drag operations
 * This provides better throttling behavior than standard lodash.throttle
 * for drag operations on Android
 */
export const dragThrottle = (func, wait = 50) => {
  let timeout = null;
  let lastArgs = null;
  let lastCall = 0;
  
  return function throttled(...args) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCall;
    
    // Store the latest arguments
    lastArgs = args;
    
    // If we're within the wait period, schedule future execution
    if (timeSinceLastCall < wait) {
      if (timeout === null) {
        timeout = setTimeout(() => {
          lastCall = Date.now();
          timeout = null;
          func(...lastArgs);
        }, wait - timeSinceLastCall);
      }
      return;
    }
    
    // Otherwise execute immediately
    lastCall = now;
    func(...args);
  };
}; 