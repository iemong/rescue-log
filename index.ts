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

filteredJson.forEach((d) => {
  const date = Colors.green(`[${d.date}]`);
  const time = Colors.red(`TIME: ${d.total_duration_formatted}`);
  const productivity = Colors.blue(`<PRODUCTIVITY: ${d.productivity_pulse}>`);

  console.log(
    `${date} ${productivity} ${time}`,
  );
});
