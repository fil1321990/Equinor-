export function formatTimeRemaining(ms: number) {
  if (!ms || ms <= 0) return "00:00:00";
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((ms % (1000 * 60)) / 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export const getOffsetMs = (obj: { d: string, h: string, m: string, s: string }) => {
  if (!obj.d && !obj.h && !obj.m && !obj.s) return 0;
  return ((Number(obj.d) || 0) * 24 * 60 * 60 + (Number(obj.h) || 0) * 60 * 60 + (Number(obj.m) || 0) * 60 + (Number(obj.s) || 0)) * 1000;
};
