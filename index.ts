import * as Colors from "https://deno.land/std/fmt/colors.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

type DateResult = {
  id: number;
  date: string;
  productivity_pulse: number;
  total_hours: number;
  total_duration_formatted: string;
};

const key = config().API_KEY;
const url = "https://www.rescuetime.com/anapi/daily_summary_feed";
const queryParams = new URLSearchParams({ key });

const res = await fetch(`${url}?${queryParams}`);

const json = await res.json();

const filteredJson: DateResult[] = json.map((data: any) => {
  const {
    id,
    date,
    productivity_pulse,
    total_hours,
    total_duration_formatted,
  } = data;
  return {
    id,
    date,
    productivity_pulse,
    total_hours,
    total_duration_formatted,
  };
});

const dayOfWeekMap = new Map([
  [0, "Sun"],
  [1, "Mon"],
  [2, "Tue"],
  [3, "Wed"],
  [4, "Thr"],
  [5, "Fri"],
  [6, "Sat"],
]);

// ${dayOfWeekMap.get(new Date(d.id * 1000).getDay())}
filteredJson.forEach((d) => {
  const dayOfWeekNum = new Date(d.id * 1000).getDay();
  if (dayOfWeekNum === 0 || dayOfWeekNum === 6) return;
  const date = Colors.green(`[${d.date} (${dayOfWeekMap.get(dayOfWeekNum)})]`);
  const time = `TIME: ${d.total_duration_formatted}`;
  const pulse = d.productivity_pulse;
  const quota = 75;
  const baseProductivity = `<PRODUCTIVITY: ${pulse}>`;
  const productivity = pulse > quota
    ? Colors.blue(baseProductivity)
    : Colors.red(baseProductivity);

  console.log(
    `${date} ${productivity} ${time}`,
  );
});
