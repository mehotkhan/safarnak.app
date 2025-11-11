import React, { useState } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomText } from '@components/display';
import { useTheme } from '@components/context';
import { useTranslation } from 'react-i18next';

export interface TourFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  difficulty?: string;
  sortBy?: 'popular' | 'rating' | 'price' | 'newest';
}

export interface PlaceFilters {
  type?: string;
  minRating?: number;
  isOpen?: boolean;
  sortBy?: 'popular' | 'rating' | 'newest';
}

export interface PostFilters {
  type?: string;
  sortBy?: 'popular' | 'newest';
}

type FilterType = 'tours' | 'places' | 'posts';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  filterType: FilterType;
  tourFilters?: TourFilters;
  placeFilters?: PlaceFilters;
  postFilters?: PostFilters;
  onApplyFilters: (filters: TourFilters | PlaceFilters | PostFilters) => void;
}

const tourCategories = [
  { id: 'adventure', label: 'adventure' },
  { id: 'culture', label: 'culture' },
  { id: 'food', label: 'food' },
  { id: 'nature', label: 'nature' },
  { id: 'relaxation', label: 'relaxation' },
];

const placeTypes = [
  { id: 'restaurant', label: 'restaurant' },
  { id: 'attraction', label: 'attraction' },
  { id: 'hotel', label: 'hotel' },
  { id: 'market', label: 'market' },
  { id: 'museum', label: 'museum' },
  { id: 'park', label: 'park' },
];

const difficulties = [
  { id: 'easy', label: 'easy' },
  { id: 'medium', label: 'medium' },
  { id: 'hard', label: 'hard' },
];

const sortOptions = [
  { id: 'popular', label: 'popular' },
  { id: 'rating', label: 'rating' },
  { id: 'price', label: 'price' },
  { id: 'newest', label: 'newest' },
];

export default function FilterModal({
  visible,
  onClose,
  filterType,
  tourFilters = {},
  placeFilters = {},
  postFilters = {},
  onApplyFilters,
}: FilterModalProps) {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const [localTourFilters, setLocalTourFilters] = useState<TourFilters>(tourFilters);
  const [localPlaceFilters, setLocalPlaceFilters] = useState<PlaceFilters>(placeFilters);
  const [localPostFilters, setLocalPostFilters] = useState<PostFilters>(postFilters);

  const handleApply = () => {
    if (filterType === 'tours') {
      onApplyFilters(localTourFilters);
    } else if (filterType === 'places') {
      onApplyFilters(localPlaceFilters);
    } else {
      onApplyFilters(localPostFilters);
    }
    onClose();
  };

  const handleReset = () => {
    if (filterType === 'tours') {
      setLocalTourFilters({});
      onApplyFilters({});
    } else if (filterType === 'places') {
      setLocalPlaceFilters({});
      onApplyFilters({});
    } else {
      setLocalPostFilters({});
      onApplyFilters({});
    }
    onClose();
  };

  const renderTourFilters = () => (
    <ScrollView className="flex-1">
      {/* Category */}
      <View className="mb-6">
        <CustomText weight="medium" className="text-base text-black dark:text-white mb-3">
          {t('explore.filters.category')}
        </CustomText>
        <View className="flex-row flex-wrap">
          {tourCategories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              onPress={() =>
                setLocalTourFilters({
                  ...localTourFilters,
                  category: localTourFilters.category === cat.id ? undefined : cat.id,
                })
              }
              className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                localTourFilters.category === cat.id
                  ? 'bg-primary'
                  : 'bg-gray-100 dark:bg-neutral-800'
              }`}
            >
              <CustomText
                className={
                  localTourFilters.category === cat.id
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }
              >
                {t(`explore.categories.${cat.label}`)}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Price Range */}
      <View className="mb-6">
        <CustomText weight="medium" className="text-base text-black dark:text-white mb-3">
          {t('explore.filters.priceRange')}
        </CustomText>
        <View className="flex-row items-center">
          <View className="flex-1 mr-2">
            <CustomText className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('explore.filters.minPrice')}
            </CustomText>
            <View className="bg-gray-100 dark:bg-neutral-800 rounded-lg px-3 py-2">
              <CustomText className="text-black dark:text-white">
                ${localTourFilters.minPrice || 0}
              </CustomText>
            </View>
          </View>
          <View className="flex-1">
            <CustomText className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t('explore.filters.maxPrice')}
            </CustomText>
            <View className="bg-gray-100 dark:bg-neutral-800 rounded-lg px-3 py-2">
              <CustomText className="text-black dark:text-white">
                ${localTourFilters.maxPrice || 10000}
              </CustomText>
            </View>
          </View>
        </View>
      </View>

      {/* Rating */}
      <View className="mb-6">
        <CustomText weight="medium" className="text-base text-black dark:text-white mb-3">
          {t('explore.filters.minRating')}
        </CustomText>
        <View className="flex-row">
          {[1, 2, 3, 4, 5].map(rating => (
            <TouchableOpacity
              key={rating}
              onPress={() =>
                setLocalTourFilters({
                  ...localTourFilters,
                  minRating: localTourFilters.minRating === rating ? undefined : rating,
                })
              }
              className={`w-12 h-12 rounded-full items-center justify-center mr-2 ${
                localTourFilters.minRating === rating
                  ? 'bg-primary'
                  : 'bg-gray-100 dark:bg-neutral-800'
              }`}
            >
              <Ionicons
                name="star"
                size={20}
                color={localTourFilters.minRating === rating ? '#fff' : (isDark ? '#9ca3af' : '#6b7280')}
              />
              <CustomText
                className={`text-xs mt-0.5 ${
                  localTourFilters.minRating === rating
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {rating}+
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Difficulty */}
      <View className="mb-6">
        <CustomText weight="medium" className="text-base text-black dark:text-white mb-3">
          {t('explore.filters.difficulty')}
        </CustomText>
        <View className="flex-row flex-wrap">
          {difficulties.map(diff => (
            <TouchableOpacity
              key={diff.id}
              onPress={() =>
                setLocalTourFilters({
                  ...localTourFilters,
                  difficulty: localTourFilters.difficulty === diff.id ? undefined : diff.id,
                })
              }
              className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                localTourFilters.difficulty === diff.id
                  ? 'bg-primary'
                  : 'bg-gray-100 dark:bg-neutral-800'
              }`}
            >
              <CustomText
                className={
                  localTourFilters.difficulty === diff.id
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }
              >
                {t(`explore.filters.${diff.id}`)}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sort By */}
      <View className="mb-6">
        <CustomText weight="medium" className="text-base text-black dark:text-white mb-3">
          {t('explore.filters.sortBy')}
        </CustomText>
        <View className="gap-2">
          {sortOptions.map(option => (
            <TouchableOpacity
              key={option.id}
              onPress={() =>
                setLocalTourFilters({
                  ...localTourFilters,
                  sortBy: option.id as any,
                })
              }
              className={`flex-row items-center justify-between p-3 rounded-lg mb-2 ${
                localTourFilters.sortBy === option.id
                  ? 'bg-primary/15 dark:bg-primary/25'
                  : 'bg-gray-100 dark:bg-neutral-800'
              }`}
            >
              <CustomText
                className={
                  localTourFilters.sortBy === option.id
                    ? 'text-primary'
                    : 'text-gray-700 dark:text-gray-300'
                }
              >
                {t(`explore.sort.${option.label}`)}
              </CustomText>
              {localTourFilters.sortBy === option.id && (
                <Ionicons name="checkmark" size={20} color="#3b82f6" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderPlaceFilters = () => (
    <ScrollView className="flex-1">
      {/* Type */}
      <View className="mb-6">
        <CustomText weight="medium" className="text-base text-black dark:text-white mb-3">
          {t('explore.filters.type')}
        </CustomText>
        <View className="flex-row flex-wrap">
          {placeTypes.map(type => (
            <TouchableOpacity
              key={type.id}
              onPress={() =>
                setLocalPlaceFilters({
                  ...localPlaceFilters,
                  type: localPlaceFilters.type === type.id ? undefined : type.id,
                })
              }
              className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                localPlaceFilters.type === type.id
                  ? 'bg-primary'
                  : 'bg-gray-100 dark:bg-neutral-800'
              }`}
            >
              <CustomText
                className={
                  localPlaceFilters.type === type.id
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }
              >
                {t(`explore.filters.${type.id}`)}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Rating */}
      <View className="mb-6">
        <CustomText weight="medium" className="text-base text-black dark:text-white mb-3">
          {t('explore.filters.minRating')}
        </CustomText>
        <View className="flex-row">
          {[1, 2, 3, 4, 5].map(rating => (
            <TouchableOpacity
              key={rating}
              onPress={() =>
                setLocalPlaceFilters({
                  ...localPlaceFilters,
                  minRating: localPlaceFilters.minRating === rating ? undefined : rating,
                })
              }
              className={`w-12 h-12 rounded-full items-center justify-center mr-2 ${
                localPlaceFilters.minRating === rating
                  ? 'bg-primary'
                  : 'bg-gray-100 dark:bg-neutral-800'
              }`}
            >
              <Ionicons
                name="star"
                size={20}
                color={localPlaceFilters.minRating === rating ? '#fff' : (isDark ? '#9ca3af' : '#6b7280')}
              />
              <CustomText
                className={`text-xs mt-0.5 ${
                  localPlaceFilters.minRating === rating
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {rating}+
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Open Now */}
      <View className="mb-6">
        <View className="flex-row items-center justify-between">
          <CustomText weight="medium" className="text-base text-black dark:text-white">
            {t('explore.filters.openNow')}
          </CustomText>
          <Switch
            value={localPlaceFilters.isOpen ?? false}
            onValueChange={value =>
              setLocalPlaceFilters({
                ...localPlaceFilters,
                isOpen: value ? true : undefined,
              })
            }
            trackColor={{ false: '#9ca3af', true: '#3b82f6' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {/* Sort By */}
      <View className="mb-6">
        <CustomText weight="medium" className="text-base text-black dark:text-white mb-3">
          {t('explore.filters.sortBy')}
        </CustomText>
        <View className="gap-2">
          {sortOptions.filter(o => o.id !== 'price').map(option => (
            <TouchableOpacity
              key={option.id}
              onPress={() =>
                setLocalPlaceFilters({
                  ...localPlaceFilters,
                  sortBy: option.id as any,
                })
              }
              className={`flex-row items-center justify-between p-3 rounded-lg mb-2 ${
                localPlaceFilters.sortBy === option.id
                  ? 'bg-primary/15 dark:bg-primary/25'
                  : 'bg-gray-100 dark:bg-neutral-800'
              }`}
            >
              <CustomText
                className={
                  localPlaceFilters.sortBy === option.id
                    ? 'text-primary'
                    : 'text-gray-700 dark:text-gray-300'
                }
              >
                {t(`explore.sort.${option.label}`)}
              </CustomText>
              {localPlaceFilters.sortBy === option.id && (
                <Ionicons name="checkmark" size={20} color="#3b82f6" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderPostFilters = () => (
    <ScrollView className="flex-1">
      {/* Type */}
      <View className="mb-6">
        <CustomText weight="medium" className="text-base text-black dark:text-white mb-3">
          {t('explore.filters.type')}
        </CustomText>
        <View className="flex-row flex-wrap">
          {[
            { id: 'trip', label: 'trips' },
            { id: 'tour', label: 'tours' },
            { id: 'place', label: 'places' },
          ].map(type => (
            <TouchableOpacity
              key={type.id}
              onPress={() =>
                setLocalPostFilters({
                  ...localPostFilters,
                  type: localPostFilters.type === type.id ? undefined : type.id,
                })
              }
              className={`px-4 py-2 rounded-full mr-2 mb-2 ${
                localPostFilters.type === type.id
                  ? 'bg-primary'
                  : 'bg-gray-100 dark:bg-neutral-800'
              }`}
            >
              <CustomText
                className={
                  localPostFilters.type === type.id
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                }
              >
                {t(`explore.categories.${type.label}`)}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sort By */}
      <View className="mb-6">
        <CustomText weight="medium" className="text-base text-black dark:text-white mb-3">
          {t('explore.filters.sortBy')}
        </CustomText>
        <View className="gap-2">
          {sortOptions.filter(o => ['popular', 'newest'].includes(o.id)).map(option => (
            <TouchableOpacity
              key={option.id}
              onPress={() =>
                setLocalPostFilters({
                  ...localPostFilters,
                  sortBy: option.id as any,
                })
              }
              className={`flex-row items-center justify-between p-3 rounded-lg mb-2 ${
                localPostFilters.sortBy === option.id
                  ? 'bg-primary/15 dark:bg-primary/25'
                  : 'bg-gray-100 dark:bg-neutral-800'
              }`}
            >
              <CustomText
                className={
                  localPostFilters.sortBy === option.id
                    ? 'text-primary'
                    : 'text-gray-700 dark:text-gray-300'
                }
              >
                {t(`explore.sort.${option.label}`)}
              </CustomText>
              {localPostFilters.sortBy === option.id && (
                <Ionicons name="checkmark" size={20} color="#3b82f6" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View
          className="bg-white dark:bg-neutral-900 rounded-t-3xl"
          style={{ height: '85%', maxHeight: '90%' }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-neutral-800">
            <CustomText weight="bold" className="text-xl text-black dark:text-white">
              {t('explore.filters.title')}
            </CustomText>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close"
                size={24}
                color={isDark ? '#fff' : '#000'}
              />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <View className="flex-1 p-4">
            {filterType === 'tours' && renderTourFilters()}
            {filterType === 'places' && renderPlaceFilters()}
            {filterType === 'posts' && renderPostFilters()}
          </View>

          {/* Footer */}
          <View className="flex-row p-4 border-t border-gray-200 dark:border-neutral-800">
            <TouchableOpacity
              onPress={handleReset}
              className="flex-1 py-3 rounded-lg bg-gray-100 dark:bg-neutral-800 mr-3 items-center"
            >
              <CustomText className="text-gray-700 dark:text-gray-300">
                {t('explore.filters.reset')}
              </CustomText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleApply}
              className="flex-1 py-3 rounded-lg bg-primary items-center"
            >
              <CustomText weight="medium" className="text-white">
                {t('explore.filters.apply')}
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

