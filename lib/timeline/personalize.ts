import { ageToDate } from "@/lib/time";
import { isRange, type TimelineItem } from "@/lib/timeline/schema";

export function eventsToPersonalized(items: TimelineItem[], birthDate: Date) {
  return items.map(item => {
    if (isRange(item)) {
      return {
        ...item,
        absolute: {
          start: ageToDate(birthDate, item.range.startAge),
          end: ageToDate(birthDate, item.range.endAge),
        },
      } as const;
    } else {
      return { ...item, absolute: ageToDate(birthDate, item.age) } as const;
    }
  });
}

