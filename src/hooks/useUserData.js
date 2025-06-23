import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook to fetch user profile and health data from Supabase
 */
export function useUserData() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [healthData, setHealthData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUserData = async () => {
    if (!user?.id) {
      setProfileData(null);
      setHealthData(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch profile and health data in parallel
      const [profileResponse, healthResponse] = await Promise.all([
        supabase
          .from('user_profile')
          .select('*')
          .eq('user_id', user.id)
          .single(),
        supabase
          .from('health_info')
          .select('*')
          .eq('user_id', user.id)
          .single()
      ]);

      // Handle profile data
      if (profileResponse.error && profileResponse.error.code !== 'PGRST116') {
        console.error('❌ Error fetching profile:', profileResponse.error);
      } else {
        setProfileData(profileResponse.data);
        console.log('✅ Profile data fetched:', !!profileResponse.data);
      }

      // Handle health data
      if (healthResponse.error && healthResponse.error.code !== 'PGRST116') {
        console.error('❌ Error fetching health data:', healthResponse.error);
      } else {
        setHealthData(healthResponse.data);
        console.log('✅ Health data fetched:', !!healthResponse.data);
      }

    } catch (error) {
      console.error('❌ Error in fetchUserData:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when user changes
  useEffect(() => {
    fetchUserData();
  }, [user?.id]);

  return {
    profileData,
    healthData,
    loading,
    error,
    refetch: fetchUserData
  };
}

export default useUserData; 