import React, { useEffect, useState } from 'react';
import { View, Text, ListRenderItem, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import JobCard, { CardProps } from '@/components/Cards/JobCard';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import apiClient from '../apiClient';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useLike } from '../context/LikeContext';
import images from '@/types/images';
import DefaultLoader from '@/components/Loader/defaultLoader';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { view_count } from '@/components/requests/requests';
import { useTheme } from '../context/ThemeContext';

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<CardProps[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<CardProps[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { toggleLike, isLiked } = useLike();
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { t } = useTranslation();
  
  const LIMIT = 10;
  const filters = ["recent", "nearby", "popular", "recommended"];
  const [activeFilter, setActiveFilter] = useState("recent");

  // Fetch standard jobs from database
  const getJobs = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;

    try {
      setLoading(true);
      const currentOffset = reset ? 0 : offset;

      const response = await apiClient.get(`job/get_jobs?limit=${LIMIT}&offset=${currentOffset}`);
      const newjobs = response.data.data || [];

      if (reset) {
        setJobs(newjobs);
        setFilteredJobs(newjobs);
        setOffset(LIMIT);
        setHasMore(response.data.pagination.has_more);
      } else {
        // Prevent accidental duplicates from rapid triggers while scrolling
        setJobs(prev => {
          const combined = [...prev, ...newjobs];
          return combined.filter((item, index, self) => self.findIndex(t => t.id === item.id) === index);
        });
        
        setFilteredJobs(prev => {
          const combined = [...prev, ...newjobs];
          return combined.filter((item, index, self) => self.findIndex(t => t.id === item.id) === index);
        });
        
        setOffset(prev => prev + LIMIT);
        setHasMore(response.data.pagination.has_more);
      }
    } catch (error: any) {
      console.log("Error loading jobs from API:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial mount logic
  useEffect(() => {
    getJobs(true);
  }, []);

  const handleFilter = async (filter: string) => {
    setActiveFilter(filter);

    // Recent Filter (Sort existing local array)
    if (filter === "recent") {
      const updatedJobs = [...jobs].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setFilteredJobs(updatedJobs);
      return;
    }

    // Popular Filter (Matches lowercase 'popular' for your translations)
    if (filter === "popular") {
      const updatedJobs = [...jobs].sort(
        (a, b) => (b.views ?? 0) - (a.views ?? 0)
      );
      setFilteredJobs(updatedJobs);
      return;
    }

    // Nearby Filter
    if (filter === "nearby") {
      const updatedJobs = jobs.filter((job) =>
        user?.address && job.location
          ? job.location.toLowerCase().includes(user.address.toLowerCase())
          : false
      );
      setFilteredJobs(updatedJobs);
      return;
    }

    // Recommended Filter (Fetches directly from your live Railway AI system)
    if (filter === "recommended") {
      try {
        setLoading(true);
        const response = await apiClient.get(`/job/recommendations/${user?.id}`);
        setFilteredJobs(response.data || []);
      } catch (error) {
        console.log("Error fetching similarity mappings:", error);
      } finally {
        setLoading(false);
      }
      return;
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (!query) {
      setFilteredJobs(jobs);
      return;
    }

    const filtered = jobs.filter((job) =>
      job.title?.toLowerCase().includes(query.toLowerCase()) ||
      job.category?.some(cat => cat.toLowerCase().includes(query.toLowerCase()))
    );

    setFilteredJobs(filtered);
  };

  const renderItem: ListRenderItem<CardProps> = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          view_count(item.id);
          router.push({
            pathname: "/pages/job/[id]",
            params: { id: String(item.id) }
          });
        }}
      >
        <JobCard
          id={item.id}
          title={item.title}
          description={item.description}
          payment={item.payment}
          cover_image_URL={item.cover_image_URL}
          category={item.category}
          employer_rating={item.employer_rating}
          employer_name={item.employer?.user_name}
          employer_verified={item.employer?.is_verified}
          created_at={item.created_at}
          views={item.views}
          Likeicon={
            isLiked(item.id) ? (
              <MaterialIcons 
                name="favorite" 
                size={20} 
                color='#ea306e'
                onPress={() => toggleLike(user?.id, item.id)} 
              />
            ) : (
              <MaterialIcons 
                name="favorite-border" 
                size={20} 
                color='#2563EB'
                onPress={() => toggleLike(user?.id, item.id)}
              />
            )
          }
        />
      </TouchableOpacity>
    );
  };

  return (
    // Preserved your intentional theme logic here
    <SafeAreaView className={isDark ? 'flex flex-1 flex-col bg-white' : 'flex flex-1 flex-col bg-back'}>
      
      {/* Search Header */}
      <View className='flex flex-col items-center pb-2'>
        <View className='w-full flex flex-row justify-between p-4 items-center'>
          <Ionicons 
            name="settings-outline" 
            size={24} 
            color={isDark ? "#6B7280" : "#ffffff"} 
            onPress={() => { router.push('/pages/Settings'); }}
          />
          <TextInput
            placeholder={t('Search')}
            placeholderTextColor={'gray'}
            className={isDark ? 'border-b-2 border-muted w-[190px] text-gray-900' : 'border-b-2 border-muted w-[190px] text-white'}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          <Feather name="search" size={24} color={isDark ? "#6B7280" : "#ffffff"} />
        </View>

        {/* Filters Tabs */}
        <FlatList
          contentContainerStyle={{ display: "flex", gap: 30, paddingHorizontal: 16, paddingVertical: 4 }}
          data={filters}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleFilter(item)}>
              <Text
                className={`font-bold pb-1 text-sm ${
                  activeFilter === item
                    ? "text-primary border-b-2 border-primary"
                    : "text-gray-400"
                }`}
              >
                {t(item)}
              </Text>
            </TouchableOpacity>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {/* Main Listings Stream */}
      <View className='flex-1 w-full'>
        <FlatList
          data={filteredJobs}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={renderItem}
          onEndReached={() => {
            // Prevent scrolling pagination from appending regular data over recommended or searched fields
            if (activeFilter !== "recommended" && !searchQuery) {
              getJobs();
            }
          }}
          onEndReachedThreshold={0.3}
          ListEmptyComponent={
            <View className='mt-20 flex flex-col items-center justify-center px-6'>
              <Image source={images.no_task} style={{ width: 140, height: 140 }} />
              <Text className='font-bold text-lg text-muted mt-4'>No Listings Found</Text>
              <Text className='text-sm text-gray-400 text-center mt-1'>
                Please check your query configurations or internet connection.
              </Text>
            </View>
          }
          ListFooterComponent={
            loading && offset > 0 ? (
              <View className="py-4">
                <Text className="text-center font-semibold text-gray-400 text-xs">Loading more positions...</Text>
              </View>
            ) : !hasMore && filteredJobs.length > 0 ? (
              <Text className="text-center py-6 text-xs font-semibold text-gray-400 tracking-wider">
                {t("No more jobs")}
              </Text>
            ) : null
          }
        />
      </View>

      {loading && offset === 0 && <DefaultLoader />}
    </SafeAreaView>
  );
};

export default Home;