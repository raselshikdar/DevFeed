export const useAnalytics = () => {
  const trackEvent = (event: string, data?: Record<string, any>) => {
    console.log(`Tracking event: ${event}`, data);
    // Implement your analytics tracking logic here
  };

  return { trackEvent };
};
