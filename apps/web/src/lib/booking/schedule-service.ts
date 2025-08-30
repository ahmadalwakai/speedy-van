import { addDays, format, isAfter, isBefore, isToday, isTomorrow, isWeekend, startOfDay, addMinutes, differenceInMinutes } from 'date-fns';
import { TimeSlot } from './schemas';
import { Coordinates } from './schemas';

// Schedule configuration
const SCHEDULE_CONFIG = {
  maxAdvanceBookingDays: 30,
  minAdvanceBookingHours: 2,
  operatingHours: {
    weekday: { start: '07:00', end: '20:00' },
    weekend: { start: '08:00', end: '18:00' },
  },
  slotDuration: 120, // 2 hours in minutes
  bufferTime: 30, // 30 minutes between bookings
  maxSlotsPerDay: 8,
  peakHours: {
    morning: { start: '08:00', end: '10:00' },
    evening: { start: '17:00', end: '19:00' },
  },
  popularSlots: ['09:00', '10:00', '14:00', '15:00'],
} as const;

// Pricing multipliers for different time slots
const TIME_SLOT_MULTIPLIERS = {
  peak: 1.2,
  popular: 1.1,
  weekend: 1.15,
  evening: 1.05,
  early: 0.95,
  late: 0.9,
} as const;

// UK bank holidays and special dates (2024-2025)
const UK_BANK_HOLIDAYS = [
  '2024-12-25', // Christmas Day
  '2024-12-26', // Boxing Day
  '2025-01-01', // New Year's Day
  '2025-03-30', // Good Friday
  '2025-04-01', // Easter Monday
  '2025-05-05', // Early May Bank Holiday
  '2025-05-26', // Spring Bank Holiday
  '2025-08-25', // Summer Bank Holiday
  '2025-12-25', // Christmas Day
  '2025-12-26', // Boxing Day
];

// Weather impact on moving (mock data - in real app, integrate with weather API)
const WEATHER_CONDITIONS = {
  clear: { available: true, multiplier: 1.0, message: '' },
  cloudy: { available: true, multiplier: 1.0, message: '' },
  lightRain: { available: true, multiplier: 1.1, message: 'Light rain expected - extra care for items' },
  heavyRain: { available: false, multiplier: 1.3, message: 'Heavy rain - moving not recommended' },
  snow: { available: false, multiplier: 1.5, message: 'Snow conditions - moving not available' },
  storm: { available: false, multiplier: 2.0, message: 'Storm warning - moving suspended' },
} as const;

// Interface for availability check
export interface AvailabilityCheck {
  date: Date;
  available: boolean;
  reason?: string;
  alternativeDates?: Date[];
}

// Interface for time slot with enhanced data
export interface EnhancedTimeSlot extends TimeSlot {
  type: 'early' | 'morning' | 'afternoon' | 'evening' | 'late';
  multiplier: number;
  weatherImpact?: {
    condition: keyof typeof WEATHER_CONDITIONS;
    message: string;
    available: boolean;
  };
  travelTime?: number; // minutes from previous booking
  demand: 'low' | 'medium' | 'high';
  savings?: number; // discount amount for off-peak slots
}

// Interface for schedule recommendations
export interface ScheduleRecommendation {
  date: Date;
  timeSlot: EnhancedTimeSlot;
  reason: string;
  savings?: number;
  priority: number; // 1-5, higher is better
}

// Utility functions
const parseTime = (timeStr: string): { hours: number; minutes: number } => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
};

const formatTime = (hours: number, minutes: number): string => {
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const isTimeInRange = (time: string, start: string, end: string): boolean => {
  const timeMinutes = parseTime(time).hours * 60 + parseTime(time).minutes;
  const startMinutes = parseTime(start).hours * 60 + parseTime(start).minutes;
  const endMinutes = parseTime(end).hours * 60 + parseTime(end).minutes;
  return timeMinutes >= startMinutes && timeMinutes < endMinutes;
};

const isBankHoliday = (date: Date): boolean => {
  const dateStr = format(date, 'yyyy-MM-dd');
  return UK_BANK_HOLIDAYS.includes(dateStr);
};

const getWeatherCondition = (date: Date): keyof typeof WEATHER_CONDITIONS => {
  // Mock weather data - in real app, integrate with weather API
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000);
  const conditions: (keyof typeof WEATHER_CONDITIONS)[] = ['clear', 'cloudy', 'lightRain'];
  return conditions[dayOfYear % conditions.length];
};

// Schedule service class
export class ScheduleService {
  private bookedSlots = new Map<string, string[]>(); // date -> array of booked times
  private travelTimeCache = new Map<string, number>();

  constructor() {
    // Initialize with some mock booked slots for demonstration
    this.initializeMockBookings();
  }

  // Check if a date is available for booking
  checkDateAvailability(date: Date): AvailabilityCheck {
    const today = startOfDay(new Date());
    const targetDate = startOfDay(date);
    
    // Check if date is in the past
    if (isBefore(targetDate, today)) {
      return {
        date,
        available: false,
        reason: 'Date is in the past',
      };
    }

    // Check minimum advance booking time
    const minBookingTime = addMinutes(new Date(), SCHEDULE_CONFIG.minAdvanceBookingHours * 60);
    if (isBefore(date, minBookingTime)) {
      return {
        date,
        available: false,
        reason: `Minimum ${SCHEDULE_CONFIG.minAdvanceBookingHours} hours advance booking required`,
        alternativeDates: [addDays(today, 1), addDays(today, 2)],
      };
    }

    // Check maximum advance booking
    const maxBookingDate = addDays(today, SCHEDULE_CONFIG.maxAdvanceBookingDays);
    if (isAfter(date, maxBookingDate)) {
      return {
        date,
        available: false,
        reason: `Bookings only available up to ${SCHEDULE_CONFIG.maxAdvanceBookingDays} days in advance`,
      };
    }

    // Check bank holidays
    if (isBankHoliday(date)) {
      return {
        date,
        available: false,
        reason: 'Bank holiday - no service available',
        alternativeDates: this.getNearbyAvailableDates(date, 3),
      };
    }

    // Check weather conditions
    const weather = getWeatherCondition(date);
    const weatherData = WEATHER_CONDITIONS[weather];
    if (!weatherData.available) {
      return {
        date,
        available: false,
        reason: weatherData.message,
        alternativeDates: this.getNearbyAvailableDates(date, 3),
      };
    }

    return { date, available: true };
  }

  // Get available time slots for a specific date
  getAvailableTimeSlots(
    date: Date,
    options: {
      travelTime?: number;
      previousBookingLocation?: Coordinates;
      currentLocation?: Coordinates;
    } = {}
  ): EnhancedTimeSlot[] {
    const { travelTime = 0 } = options;
    
    const availability = this.checkDateAvailability(date);
    if (!availability.available) {
      return [];
    }

    const isWeekendDay = isWeekend(date);
    const operatingHours = isWeekendDay 
      ? SCHEDULE_CONFIG.operatingHours.weekend 
      : SCHEDULE_CONFIG.operatingHours.weekday;

    const slots: EnhancedTimeSlot[] = [];
    const dateStr = format(date, 'yyyy-MM-dd');
    const bookedTimes = this.bookedSlots.get(dateStr) || [];
    const weather = getWeatherCondition(date);
    const weatherData = WEATHER_CONDITIONS[weather];

    // Generate time slots
    const startTime = parseTime(operatingHours.start);
    const endTime = parseTime(operatingHours.end);
    let currentTime = startTime.hours * 60 + startTime.minutes;
    const endMinutes = endTime.hours * 60 + endTime.minutes;

    while (currentTime + SCHEDULE_CONFIG.slotDuration <= endMinutes) {
      const slotHours = Math.floor(currentTime / 60);
      const slotMinutes = currentTime % 60;
      const timeStr = formatTime(slotHours, slotMinutes);
      const endTimeStr = formatTime(
        Math.floor((currentTime + SCHEDULE_CONFIG.slotDuration) / 60),
        (currentTime + SCHEDULE_CONFIG.slotDuration) % 60
      );

      // Check if slot is already booked
      const isBooked = bookedTimes.includes(timeStr);
      
      // Check if slot conflicts with travel time
      const hasConflict = travelTime > 0 && currentTime < travelTime;

      if (!isBooked && !hasConflict) {
        // Determine slot type
        let type: EnhancedTimeSlot['type'] = 'afternoon';
        if (isTimeInRange(timeStr, '07:00', '09:00')) type = 'early';
        else if (isTimeInRange(timeStr, '09:00', '12:00')) type = 'morning';
        else if (isTimeInRange(timeStr, '12:00', '17:00')) type = 'afternoon';
        else if (isTimeInRange(timeStr, '17:00', '20:00')) type = 'evening';
        else type = 'late';

        // Calculate multiplier
        let multiplier = 1.0;
        if (isWeekendDay) multiplier *= TIME_SLOT_MULTIPLIERS.weekend;
        if (isTimeInRange(timeStr, SCHEDULE_CONFIG.peakHours.morning.start, SCHEDULE_CONFIG.peakHours.morning.end) ||
            isTimeInRange(timeStr, SCHEDULE_CONFIG.peakHours.evening.start, SCHEDULE_CONFIG.peakHours.evening.end)) {
          multiplier *= TIME_SLOT_MULTIPLIERS.peak;
        }
        if (SCHEDULE_CONFIG.popularSlots.includes(timeStr)) {
          multiplier *= TIME_SLOT_MULTIPLIERS.popular;
        }
        if (type === 'early') multiplier *= TIME_SLOT_MULTIPLIERS.early;
        if (type === 'late') multiplier *= TIME_SLOT_MULTIPLIERS.late;
        if (type === 'evening') multiplier *= TIME_SLOT_MULTIPLIERS.evening;

        // Apply weather multiplier
        multiplier *= weatherData.multiplier;

        // Determine demand level
        let demand: EnhancedTimeSlot['demand'] = 'medium';
        if (SCHEDULE_CONFIG.popularSlots.includes(timeStr)) demand = 'high';
        else if (type === 'early' || type === 'late') demand = 'low';

        // Calculate savings for off-peak slots
        let savings: number | undefined;
        if (multiplier < 1.0) {
          savings = Math.round((1.0 - multiplier) * 100); // Percentage savings
        }

        const slot: EnhancedTimeSlot = {
          id: `${dateStr}-${timeStr}`,
          startTime: timeStr,
          endTime: endTimeStr,
          available: true,
          price: 0, // Will be calculated by pricing engine
          popular: SCHEDULE_CONFIG.popularSlots.includes(timeStr),
          recommended: false, // Will be set by recommendation engine
          type,
          multiplier,
          weatherImpact: weatherData.available ? undefined : {
            condition: weather,
            message: weatherData.message,
            available: weatherData.available,
          },
          travelTime,
          demand,
          savings,
        };

        slots.push(slot);
      }

      currentTime += SCHEDULE_CONFIG.slotDuration + SCHEDULE_CONFIG.bufferTime;
    }

    return slots;
  }

  // Get smart recommendations for scheduling
  getScheduleRecommendations(
    startDate: Date = new Date(),
    options: {
      flexibility: 'exact' | 'flexible' | 'asap';
      preferredTimes?: string[];
      avoidWeekends?: boolean;
      maxRecommendations?: number;
    } = {}
  ): ScheduleRecommendation[] {
    const {
      flexibility = 'flexible',
      preferredTimes = [],
      avoidWeekends = false,
      maxRecommendations = 5,
    } = options;

    const recommendations: ScheduleRecommendation[] = [];
    const searchDays = flexibility === 'exact' ? 1 : flexibility === 'asap' ? 7 : 14;

    for (let i = 0; i < searchDays; i++) {
      const date = addDays(startDate, i);
      
      if (avoidWeekends && isWeekend(date)) continue;

      const availability = this.checkDateAvailability(date);
      if (!availability.available) continue;

      const slots = this.getAvailableTimeSlots(date);

      slots.forEach(slot => {
        let priority = 1;
        let reason = 'Available slot';
        let savings: number | undefined;

        // Boost priority for preferred times
        if (preferredTimes.includes(slot.startTime)) {
          priority += 2;
          reason = 'Matches your preferred time';
        }

        // Boost priority for off-peak slots with savings
        if (slot.savings && slot.savings > 0) {
          priority += 1;
          savings = slot.savings;
          reason = `Save ${slot.savings}% with off-peak booking`;
        }

        // Boost priority for popular slots
        if (slot.popular && flexibility !== 'asap') {
          priority += 1;
          reason = 'Popular time slot';
        }

        // Boost priority for ASAP bookings
        if (flexibility === 'asap') {
          if (isToday(date)) priority += 3;
          else if (isTomorrow(date)) priority += 2;
          reason = 'Earliest available';
        }

        // Reduce priority for weekend slots if not preferred
        if (isWeekend(date) && !avoidWeekends) {
          priority -= 1;
        }

        // Reduce priority for very early or late slots
        if (slot.type === 'early' || slot.type === 'late') {
          priority -= 1;
        }

        recommendations.push({
          date,
          timeSlot: slot,
          reason,
          savings,
          priority,
        });
      });
    }

    // Sort by priority and return top recommendations
    return recommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, maxRecommendations);
  }

  // Book a time slot
  async bookTimeSlot(date: Date, timeSlot: string): Promise<{
    success: boolean;
    bookingId?: string;
    error?: string;
  }> {
    const dateStr = format(date, 'yyyy-MM-dd');
    const bookedTimes = this.bookedSlots.get(dateStr) || [];

    // Check if slot is still available
    if (bookedTimes.includes(timeSlot)) {
      return {
        success: false,
        error: 'Time slot is no longer available',
      };
    }

    // Check date availability
    const availability = this.checkDateAvailability(date);
    if (!availability.available) {
      return {
        success: false,
        error: availability.reason || 'Date is not available',
      };
    }

    // Book the slot
    bookedTimes.push(timeSlot);
    this.bookedSlots.set(dateStr, bookedTimes);

    const bookingId = `booking_${dateStr}_${timeSlot.replace(':', '')}_${Date.now()}`;

    return {
      success: true,
      bookingId,
    };
  }

  // Cancel a booking
  async cancelBooking(date: Date, timeSlot: string): Promise<boolean> {
    const dateStr = format(date, 'yyyy-MM-dd');
    const bookedTimes = this.bookedSlots.get(dateStr) || [];
    const index = bookedTimes.indexOf(timeSlot);

    if (index > -1) {
      bookedTimes.splice(index, 1);
      this.bookedSlots.set(dateStr, bookedTimes);
      return true;
    }

    return false;
  }

  // Get busy periods for calendar visualization
  getBusyPeriods(startDate: Date, endDate: Date): Array<{
    date: Date;
    busyLevel: 'low' | 'medium' | 'high';
    availableSlots: number;
    totalSlots: number;
  }> {
    const periods: Array<{
      date: Date;
      busyLevel: 'low' | 'medium' | 'high';
      availableSlots: number;
      totalSlots: number;
    }> = [];

    let currentDate = startDate;
    while (isBefore(currentDate, endDate) || currentDate.getTime() === endDate.getTime()) {
      const slots = this.getAvailableTimeSlots(currentDate);
      const totalSlots = SCHEDULE_CONFIG.maxSlotsPerDay;
      const availableSlots = slots.length;
      const occupancyRate = (totalSlots - availableSlots) / totalSlots;

      let busyLevel: 'low' | 'medium' | 'high' = 'low';
      if (occupancyRate > 0.8) busyLevel = 'high';
      else if (occupancyRate > 0.5) busyLevel = 'medium';

      periods.push({
        date: currentDate,
        busyLevel,
        availableSlots,
        totalSlots,
      });

      currentDate = addDays(currentDate, 1);
    }

    return periods;
  }

  // Private helper methods
  private initializeMockBookings(): void {
    // Add some mock bookings for demonstration
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = addDays(today, i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const mockBookings: string[] = [];

      // Randomly book some popular slots
      if (Math.random() > 0.5) mockBookings.push('09:00');
      if (Math.random() > 0.7) mockBookings.push('14:00');
      if (Math.random() > 0.8) mockBookings.push('10:00');

      if (mockBookings.length > 0) {
        this.bookedSlots.set(dateStr, mockBookings);
      }
    }
  }

  private getNearbyAvailableDates(targetDate: Date, count: number): Date[] {
    const dates: Date[] = [];
    let offset = 1;

    while (dates.length < count && offset <= 14) {
      const beforeDate = addDays(targetDate, -offset);
      const afterDate = addDays(targetDate, offset);

      if (this.checkDateAvailability(afterDate).available) {
        dates.push(afterDate);
      }

      if (dates.length < count && this.checkDateAvailability(beforeDate).available) {
        dates.push(beforeDate);
      }

      offset++;
    }

    return dates.sort((a, b) => a.getTime() - b.getTime());
  }
}

// Create singleton instance
export const scheduleService = new ScheduleService();

// React hook for using schedule service
export const useScheduleService = () => {
  return scheduleService;
};

// Hook for getting recommendations with React state
export const useScheduleRecommendations = (
  startDate: Date,
  options: Parameters<ScheduleService['getScheduleRecommendations']>[1] = {}
) => {
  const service = useScheduleService();
  
  const getRecommendations = () => {
    return service.getScheduleRecommendations(startDate, options);
  };

  return { getRecommendations };
};

export { SCHEDULE_CONFIG, TIME_SLOT_MULTIPLIERS, UK_BANK_HOLIDAYS };

