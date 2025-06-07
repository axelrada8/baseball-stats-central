
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'free' | 'premium';
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  start_date: string;
  end_date?: string;
  trial_end_date: string;
  paypal_subscription_id?: string;
  amount?: number;
  currency?: string;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasPremiumAccess, setHasPremiumAccess] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchSubscription();
      checkPremiumAccess();
    } else {
      setSubscription(null);
      setHasPremiumAccess(false);
      setLoading(false);
    }
  }, [user]);

  const fetchSubscription = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        return;
      }

      setSubscription(data);
    } catch (error) {
      console.error('Error in fetchSubscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkPremiumAccess = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('has_premium_access', {
        user_uuid: user.id
      });

      if (error) {
        console.error('Error checking premium access:', error);
        return;
      }

      setHasPremiumAccess(data || false);
    } catch (error) {
      console.error('Error in checkPremiumAccess:', error);
    }
  };

  const isTrialActive = () => {
    if (!subscription) return false;
    const trialEnd = new Date(subscription.trial_end_date);
    return subscription.status === 'trial' && trialEnd > new Date();
  };

  const getDaysRemaining = () => {
    if (!subscription || !isTrialActive()) return 0;
    const trialEnd = new Date(subscription.trial_end_date);
    const now = new Date();
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return {
    subscription,
    loading,
    hasPremiumAccess,
    isTrialActive: isTrialActive(),
    daysRemaining: getDaysRemaining(),
    refetch: fetchSubscription,
    checkPremiumAccess
  };
}
