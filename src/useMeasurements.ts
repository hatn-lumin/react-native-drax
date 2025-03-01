import throttle from 'lodash.throttle';
import { useCallback, useRef } from 'react';
import { View } from 'react-native';
import Reanimated, { useAnimatedRef } from 'react-native-reanimated';

import { DraxViewMeasurements } from './types';

/**
 * A utility hook to handle measurements with throttling for better performance
 * Especially useful for Android where measuring can be expensive
 */
export const useOptimizedMeasurements = (
  onMeasured: (measurements: DraxViewMeasurements) => void,
  throttleMs = 50
) => {
  // Use ref to track last measurements to prevent unnecessary updates
  const lastMeasurementsRef = useRef<DraxViewMeasurements | null>(null);
  
  // Create animated ref for the view
  const viewRef = useAnimatedRef<Reanimated.View>();
  
  // Create throttled measure function
  const throttledMeasure = useCallback(
    throttle(() => {
      if (!viewRef.current) return;
      
      viewRef.current.measure?.((x, y, width, height, pageX, pageY) => {
        const newMeasurements: DraxViewMeasurements = {
          x: pageX,
          y: pageY,
          width,
          height,
        };
        
        // Skip update if measurements haven't changed significantly
        const lastMeasurements = lastMeasurementsRef.current;
        if (
          lastMeasurements &&
          Math.abs(lastMeasurements.x - newMeasurements.x) < 1 &&
          Math.abs(lastMeasurements.y - newMeasurements.y) < 1 &&
          Math.abs(lastMeasurements.width - newMeasurements.width) < 1 &&
          Math.abs(lastMeasurements.height - newMeasurements.height) < 1
        ) {
          return;
        }
        
        // Update ref and call the measurement handler
        lastMeasurementsRef.current = newMeasurements;
        onMeasured(newMeasurements);
      });
    }, throttleMs),
    [viewRef, onMeasured, throttleMs]
  );
  
  // Handler for onLayout events
  const onLayout = useCallback(() => {
    throttledMeasure();
  }, [throttledMeasure]);
  
  return {
    viewRef,
    onLayout,
    measure: throttledMeasure,
  };
}; 