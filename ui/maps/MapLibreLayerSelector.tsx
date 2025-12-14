/**
 * MapLibre Layer Selector Component
 * 
 * UI component for selecting map styles/layers.
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export type MapLibreLayer = 'standard' | 'satellite' | 'terrain' | 'dark' | 'streets';

export interface MapLayerOption {
  id: MapLibreLayer;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  styleUrl: string;
}

export const MAP_LAYER_OPTIONS: MapLayerOption[] = [
  {
    id: 'standard',
    name: 'Standard',
    icon: 'map-outline',
    styleUrl: 'standard', // Special marker - will be converted to style object
  },
  {
    id: 'satellite',
    name: 'Satellite',
    icon: 'globe-outline',
    styleUrl: 'satellite', // Special marker - will be converted to style object (Hybrid OSM style - free, no API key)
    // Note: True satellite imagery requires API keys. This uses a satellite-like OSM style.
    // For production, consider MapTiler or Mapbox satellite styles with API keys.
  },
  {
    id: 'terrain',
    name: 'Terrain',
    icon: 'layers-outline',
    styleUrl: 'terrain', // Special marker - will be converted to style object (OpenTopoMap - free)
  },
  {
    id: 'dark',
    name: 'Dark',
    icon: 'moon-outline',
    styleUrl: 'https://data.lfmaps.fr/styles/positron', // LFMaps Positron (free, no API key)
  },
  {
    id: 'streets',
    name: 'Streets',
    icon: 'navigate-outline',
    styleUrl: 'https://data.lfmaps.fr/styles/bright', // LFMaps Bright (free, no API key)
  },
];

/**
 * Get a style URL for a given layer.
 * You can customize this function to use different style URLs based on your needs.
 * For production, consider using MapTiler, Mapbox, or other services with API keys.
 */
export function getStyleUrlForLayer(layer: MapLibreLayer): string {
  const option = MAP_LAYER_OPTIONS.find((opt) => opt.id === layer);
  return option?.styleUrl || MAP_LAYER_OPTIONS[0].styleUrl;
}

interface MapLibreLayerSelectorProps {
  currentLayer: MapLibreLayer;
  onLayerChange: (layer: MapLibreLayer) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  collapsed?: boolean;
}

export default function MapLibreLayerSelector({
  currentLayer,
  onLayerChange,
  position = 'top-right',
  collapsed = false,
}: MapLibreLayerSelectorProps) {
  const [isExpanded, setIsExpanded] = React.useState(!collapsed);

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  const currentOption = MAP_LAYER_OPTIONS.find((opt) => opt.id === currentLayer) || MAP_LAYER_OPTIONS[0];

  return (
    <View className={`absolute ${positionClasses[position]} z-50`}>
      {isExpanded ? (
        <View className="overflow-hidden rounded-xl border border-gray-200 bg-white/95 shadow-lg dark:border-gray-700 dark:bg-gray-900/95">
          {/* Header */}
          <TouchableOpacity
            onPress={() => setIsExpanded(false)}
            className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700"
          >
            <View className="flex-row items-center">
              <Ionicons name={currentOption.icon} size={20} color="#6b7280" />
              <Text className="ml-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                Map Style
              </Text>
            </View>
            <Ionicons name="chevron-up" size={20} color="#6b7280" />
          </TouchableOpacity>

          {/* Layer Options */}
          <View className="py-2">
            {MAP_LAYER_OPTIONS.map((option) => {
              const isSelected = option.id === currentLayer;
              return (
                <TouchableOpacity
                  key={option.id}
                  onPress={() => {
                    console.log('Layer selector: Changing to layer', option.id);
                    onLayerChange(option.id);
                    if (collapsed) {
                      setIsExpanded(false);
                    }
                  }}
                  className={`flex-row items-center px-4 py-3 ${
                    isSelected
                      ? 'border-l-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'active:bg-gray-50 dark:active:bg-gray-800'
                  }`}
                >
                  <Ionicons
                    name={option.icon}
                    size={20}
                    color={isSelected ? '#8b5cf6' : '#6b7280'}
                  />
                  <Text
                    className={`ml-3 text-sm ${
                      isSelected
                        ? 'font-semibold text-purple-600 dark:text-purple-400'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {option.name}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={18}
                      color="#8b5cf6"
                      style={{ marginLeft: 'auto' }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ) : (
        <TouchableOpacity
          onPress={() => setIsExpanded(true)}
          className="flex-row items-center rounded-xl border border-gray-200 bg-white/95 px-4 py-3 shadow-lg dark:border-gray-700 dark:bg-gray-900/95"
        >
          <Ionicons name={currentOption.icon} size={20} color="#6b7280" />
          <Text className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            {currentOption.name}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#6b7280" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      )}
    </View>
  );
}

