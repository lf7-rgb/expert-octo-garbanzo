import WeatherIcon from './WeatherIcon';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/**
 * The OWM /forecast endpoint returns 40 readings at 3-hour intervals.
 * We filter to the closest reading to noon (12:00:00) per calendar day.
 */
function getDailyForecasts(list) {
  const seen = new Set();
  return list
    .filter((item) => {
      const date = item.dt_txt.split(' ')[0];
      if (!seen.has(date) && item.dt_txt.includes('12:00:00')) {
        seen.add(date);
        return true;
      }
      return false;
    })
    .slice(0, 5);
}

export default function Forecast({ data }) {
  if (!data || !data.list) return null;

  const dailyForecasts = getDailyForecasts(data.list);

  return (
    <div className="forecast">
      <h3>5-Day Forecast</h3>
      <div className="forecast__cards">
        {dailyForecasts.map((item) => {
          const date = new Date(item.dt * 1000);
          const dayName = DAYS[date.getDay()];
          const {
            main: { temp_min, temp_max },
            weather: [{ description, icon }],
          } = item;
          return (
            <div key={item.dt} className="forecast__card card">
              <p className="forecast__day">{dayName}</p>
              <WeatherIcon icon={icon} size={50} />
              <p className="forecast__desc">{description}</p>
              <p className="forecast__temps">
                <span>{Math.round(temp_max)}°</span>{' '}
                <span className="low">{Math.round(temp_min)}°</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
