/**
 * Performance Optimizations for React Native Drax
 * 
 * This file exports all performance-related utilities for easy import in your app.
 */

import { configureDraxPerformance, dragThrottle } from './android-performance';
import { useOptimizedMeasurements } from './src/useMeasurements';

export {
  // Android-specific optimizations
  configureDraxPerformance,
  dragThrottle,
  
  // Optimized hooks
  useOptimizedMeasurements,
};

/**
 * Usage instructions:
 * 
 * 1. In your app's entry point (e.g., App.js, index.js), import and call:
 *    
 *    import { configureDraxPerformance } from 'path/to/performance-optimizations';
 *    
 *    // Call this before rendering your app
 *    configureDraxPerformance();
 * 
 * 2. For any component that does frequent measurements or updates during
 *    dragging, consider using the optimized hooks:
 * 
 *    import { useOptimizedMeasurements } from 'path/to/performance-optimizations';
 * 
 *    // In your component:
 *    const { viewRef, onLayout, measure } = useOptimizedMeasurements(
 *      (measurements) => {
 *        // Do something with measurements
 *      },
 *      50 // throttle in ms
 *    );
 * 
 * 3. For any custom drag callbacks that might be called frequently, use dragThrottle:
 * 
 *    import { dragThrottle } from 'path/to/performance-optimizations';
 * 
 *    const handleDrag = dragThrottle((event) => {
 *      // Handle drag event
 *    }, 50);
 */
