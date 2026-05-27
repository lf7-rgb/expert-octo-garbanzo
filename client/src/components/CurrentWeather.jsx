export default function CurrentWeather({ data }) {
  if (!data) return null;

  const {
    name,
    sys: { country },
    main: { temp, feels_like, humidity },
    wind: { speed },
    weather: [{ description, icon }],
  } = data;

  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <div className="current-weather card">
      <div className="current-weather__header">
        <h2>
          {name}, {country}
        </h2>
        <img src={iconUrl} alt={description} width={80} height={80} />
      </div>
      <p className="current-weather__temp">{Math.round(temp)}°F</p>
      <p className="current-weather__desc">{description}</p>
      <div className="current-weather__details">
        <span>Feels like {Math.round(feels_like)}°F</span>
        <span>Humidity {humidity}%</span>
        <span>Wind {Math.round(speed)} mph</span>
      </div>
    </div>
  );
}
