export const formatTimestamp = (timestamp: string | Date): string => {
  return new Date(timestamp).toLocaleString();
};
