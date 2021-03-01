import { config } from "https://deno.land/x/dotenv/mod.ts";

const key = config().API_KEY;
const url = "https://www.rescuetime.com/anapi/daily_summary_feed";
const queryParams = new URLSearchParams({ key });

const res = await fetch(`${url}?${queryParams}`);

const json = await res.json();

console.log(json);
