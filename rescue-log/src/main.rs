extern crate dotenv;

use colored::{ColoredString, Colorize};
use reqwest;
use serde::Deserialize;

#[derive(Deserialize, Debug)]
struct RescueLog {
    id: i32,
    date: String,
    productivity_pulse: u8,
    total_hours: f32,
    total_duration_formatted: String,
}

#[tokio::main]
async fn main() -> Result<(), reqwest::Error> {
    let key = "API_KEY";
    let token = dotenv::var(key).unwrap();

    let url = format!(
        "https://www.rescuetime.com/anapi/daily_summary_feed?key={token}",
        token = token
    );
    let res = reqwest::get(url).await?;
    // println!("Status: {}", res.status());
    // println!("Headers:\n{:#?}", res.headers());

    let logs: Vec<RescueLog> = res.json().await?;

    for i in logs {
        let colored_productivity = paint_by_ratio(i.productivity_pulse);
        println!(
            "[日付: {}] <生産性: {}> 労働時間: {}",
            i.date, colored_productivity, i.total_duration_formatted
        );
    }
    Ok(())
}

fn u82string(num: u8) -> String {
    num.to_string()
}

fn paint_by_ratio(ratio: u8) -> ColoredString {
    if ratio > 75 {
        (&*u82string(ratio)).blue()
    } else {
        (&*u82string(ratio)).red()
    }
}
