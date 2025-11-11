import React, { useState, useEffect, useCallback } from 'react';
import { useNewAlertsSubscription } from '@api/hooks';
import { useAppSelector } from '@state/hooks';
import { Toast } from './Toast';

interface Notification {
  id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'error' | 'warning';
}

export function NotificationWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAppSelector(state => state.auth);
  const [currentToast, setCurrentToast] = useState<Notification | null>(null);
  const [toastQueue, setToastQueue] = useState<Notification[]>([]);
  const [_shownIds, setShownIds] = useState<Set<string>>(new Set());

  // Subscribe to new alerts
  const { data: subscriptionData, error: subscriptionError } = useNewAlertsSubscription({
    skip: !user?.id,
  });

  // Handle new alerts from subscription
  useEffect(() => {
    if (!subscriptionData?.newAlerts) return;

    const alert = subscriptionData.newAlerts;
    
    console.log('[NotificationWrapper] New alert received:', alert);
    
    // Only show alerts for the current user
    if (alert.userId !== user?.id) {
      console.log('[NotificationWrapper] Alert filtered - different userId:', alert.userId, 'vs', user?.id);
      return;
    }

    // Use setTimeout to defer state updates and avoid cascading renders
    setTimeout(() => {
      setShownIds(prev => {
        if (prev.has(alert.id)) {
          console.log('[NotificationWrapper] Alert already shown, skipping:', alert.id);
          return prev;
        }

        // Determine toast type based on alert type
        let toastType: 'info' | 'success' | 'error' | 'warning' = 'info';
        if (alert.type === 'trip') {
          if (alert.step === alert.totalSteps) {
            toastType = 'success';
          } else {
            toastType = 'info';
          }
        }

        const notification: Notification = {
          id: alert.id,
          title: alert.title,
          message: alert.message,
          type: toastType,
        };

        console.log('[NotificationWrapper] Adding notification to queue:', notification);

        // Add to queue
        setToastQueue(prevQueue => {
          const newQueue = [...prevQueue, notification];
          console.log('[NotificationWrapper] Queue updated, length:', newQueue.length);
          return newQueue;
        });

        // Mark as shown
        return new Set([...prev, alert.id]);
      });
    }, 0);
  }, [subscriptionData?.newAlerts?.id, subscriptionData?.newAlerts, user?.id]);

  // Process toast queue - show next toast when current one is dismissed
  useEffect(() => {
    if (!currentToast && toastQueue.length > 0) {
      // Show next toast in queue
      const nextToast = toastQueue[0];
      console.log('[NotificationWrapper] Processing queue, showing toast:', nextToast, 'Queue length:', toastQueue.length);
      
      // Use setTimeout to ensure state updates happen in order
      setTimeout(() => {
        setCurrentToast(nextToast);
        setToastQueue(prev => {
          const remaining = prev.slice(1);
          console.log('[NotificationWrapper] Remaining in queue after showing toast:', remaining.length);
          return remaining;
        });
      }, 0);
    }
  }, [currentToast, toastQueue]);

  const handleToastClose = useCallback(() => {
    setCurrentToast(null);
  }, []);

  // Log subscription errors and connection status
  useEffect(() => {
    if (subscriptionError) {
      console.error('[NotificationWrapper] Subscription error:', subscriptionError);
      // If socket closed, Apollo will automatically retry, but we can log it
      if (subscriptionError.message?.includes('Socket closed')) {
        console.warn('[NotificationWrapper] WebSocket closed, will retry automatically');
      }
    }
  }, [subscriptionError]);

  // Debug: Log current toast state
  useEffect(() => {
    if (currentToast) {
      console.log('[NotificationWrapper] Current toast:', currentToast);
    }
    if (toastQueue.length > 0) {
      console.log('[NotificationWrapper] Queue length:', toastQueue.length);
    }
  }, [currentToast, toastQueue.length]);

  return (
    <>
      {children}
      {currentToast && (
        <Toast
          visible={true}
          title={currentToast.title}
          message={currentToast.message}
          type={currentToast.type}
          onClose={handleToastClose}
        />
      )}
    </>
  );
}

