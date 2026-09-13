// US Federal & Common State Holidays (Fixed and rule-based)
function isHoliday(date: Date): boolean {
  const month = date.getMonth(); // 0-indexed
  const day = date.getDate();
  const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday

  // New Year's Day (Jan 1)
  if (month === 0 && day === 1) return true;
  // Independence Day (July 4)
  if (month === 6 && day === 4) return true;
  // Veterans Day (Nov 11)
  if (month === 10 && day === 11) return true;
  // Christmas Day (Dec 25)
  if (month === 11 && day === 25) return true;
  // Juneteenth (June 19)
  if (month === 5 && day === 19) return true;

  // MLK Day (3rd Monday in Jan)
  if (month === 0 && dayOfWeek === 1 && day >= 15 && day <= 21) return true;
  // Presidents Day (3rd Monday in Feb)
  if (month === 1 && dayOfWeek === 1 && day >= 15 && day <= 21) return true;
  // Memorial Day (last Monday in May)
  if (month === 4 && dayOfWeek === 1 && day >= 25) return true;
  // Labor Day (1st Monday in Sep)
  if (month === 8 && dayOfWeek === 1 && day <= 7) return true;
  // Columbus Day / Indigenous Peoples Day (2nd Monday in Oct)
  if (month === 9 && dayOfWeek === 1 && day >= 8 && day <= 14) return true;
  // Thanksgiving (4th Thursday in Nov)
  if (month === 10 && dayOfWeek === 4 && day >= 22 && day <= 28) return true;

  return false;
}

export function calculateStatutoryDeadline(startDateStr: string, daysCount: number, dayType: 'business' | 'calendar'): string {
  const date = new Date(startDateStr);
  if (isNaN(date.getTime())) {
    const fallback = new Date();
    fallback.setDate(fallback.getDate() + daysCount);
    return fallback.toISOString().split('T')[0];
  }

  let remaining = daysCount;
  const current = new Date(date);

  if (dayType === 'calendar') {
    current.setDate(current.getDate() + remaining);
    // If deadline falls on weekend or holiday, roll forward to next business day
    while (current.getDay() === 0 || current.getDay() === 6 || isHoliday(current)) {
      current.setDate(current.getDate() + 1);
    }
  } else {
    // Business days calculation
    while (remaining > 0) {
      current.setDate(current.getDate() + 1);
      const dow = current.getDay();
      if (dow !== 0 && dow !== 6 && !isHoliday(current)) {
        remaining--;
      }
    }
  }

  return current.toISOString().split('T')[0];
}

export function getDaysRemaining(deadlineStr: string): { days: number; isOverdue: boolean; formatted: string } {
  const target = new Date(deadlineStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      days: Math.abs(diffDays),
      isOverdue: true,
      formatted: `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} overdue`
    };
  } else if (diffDays === 0) {
    return {
      days: 0,
      isOverdue: false,
      formatted: 'Due today'
    };
  } else {
    return {
      days: diffDays,
      isOverdue: false,
      formatted: `${diffDays} day${diffDays === 1 ? '' : 's'} remaining`
    };
  }
}
