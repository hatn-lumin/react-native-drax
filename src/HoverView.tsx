import React, { memo, ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import Reanimated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';

import { DraxInternalRenderHoverViewProps, DraxViewProps } from './types';

export const HoverView = memo(
    ({
        internalProps,
        ...props
    }: { internalProps: DraxInternalRenderHoverViewProps } & Partial<DraxViewProps>): ReactNode => {
        const { key, hoverPosition, viewState, trackingStatus, dimensions, scrollPosition } = internalProps;

        // Create animated style that runs entirely on the UI thread
        const animatedStyle = useAnimatedStyle(() => {
            const position = hoverPosition.value;

            // Use scroll position offset if available
            const scrollOffset = scrollPosition
                ? {
                      x: scrollPosition.value.x,
                      y: scrollPosition.value.y,
                  }
                : { x: 0, y: 0 };

            return {
                position: 'absolute',
                left: position.x - scrollOffset.x,
                top: position.y - scrollOffset.y,
                width: dimensions.width,
                height: dimensions.height,
                opacity: withTiming(1, { duration: 150 }), // Smooth fade-in
            };
        }, []);

        return (
            <Reanimated.View key={key} style={[styles.hoverView, animatedStyle]} collapsable={false}>
                {props.renderContent
                    ? props.renderContent({
                          viewState,
                          trackingStatus,
                          hover: true,
                          children: props.children,
                          dimensions,
                      })
                    : props.children}
            </Reanimated.View>
        );
    }
);

const styles = StyleSheet.create({
    hoverView: {
        position: 'absolute',
    },
});
