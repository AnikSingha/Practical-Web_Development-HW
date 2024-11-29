import { useState } from "react";

export const Heatmap = ({ data }) => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [dayDetails, setDayDetails] = useState(null);
  const [tooltip, setTooltip] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const aggregatedData = data.reduce((acc, record) => {
    const date = record.Date;
    if (!acc[date]) {
      acc[date] = { count: 0, songs: {} };
    }
    acc[date].count += 1;
    acc[date].songs[record["Song Name"]] =
      (acc[date].songs[record["Song Name"]] || 0) + 1;
    return acc;
  }, {});

  const getWeeksInMonth = (month) => {
    const daysInMonth = new Date(2024, month + 1, 0).getDate();
    let firstDayOfMonth = new Date(2024, month, 1).getDay();
    const weeks = [];
    
    let day = 1;
    while (day <= daysInMonth) {
        const week = Array(7).fill(null);
        
        if (weeks.length === 0) {
          for (let i = 0; i < firstDayOfMonth; i++) {
            week[i] = null;
          }
        }
        
        for (let i = firstDayOfMonth; i < 7 && day <= daysInMonth; i++) {
          const dateString = `2024-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
          week[i] = dateString;
          day++;
        }
        
        firstDayOfMonth = 0;
        
        weeks.push(week);
      }
    
    const lastWeek = weeks[weeks.length - 1];
    for (let i = lastWeek.filter(d => d !== null).length; i < 7; i++) {
      lastWeek[i] = null;
    }
    
    return weeks;
  };

  const months = Array.from({ length: 12 }, (_, i) => i);

  const handleDayClick = (date) => {
    const details = aggregatedData[date];
    if (details) {
      const topSong = Object.entries(details.songs).reduce(
        (top, [song, count]) => (count > top.count ? { song, count } : top),
        { song: null, count: 0 }
      );
      setSelectedDay(date);
      setDayDetails({
        total: details.count,
        topSong: topSong.song,
      });
    } else {
      setSelectedDay(null);
      setDayDetails(null);
    }
  };

  const handleMouseOver = (date, event) => {
    const details = aggregatedData[date];
    if (details) {
      const topSong = Object.entries(details.songs).reduce(
        (top, [song, count]) => (count > top.count ? { song, count } : top),
        { song: null, count: 0 }
      );
      setTooltip({
        date,
        song: topSong.song,
        totalSongs: details.count,
      });

      const rect = event.target.getBoundingClientRect();
      setTooltipPosition({
        top: rect.top,
        left: rect.right + 10,
      });
    } else {
      setTooltip(null);
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  const maxCount = Math.max(
    1,
    ...Object.values(aggregatedData).map((v) => v.count)
  );

  const getColor = (count) => {
    if (!count) return "#e6f3e6";
    const intensity = Math.min(1, count / maxCount);
    const baseColors = [
      { r: 230, g: 243, b: 230 },   
      { r: 120, g: 200, b: 120 },   
      { r: 50, g: 180, b: 50 },     
      { r: 20, g: 160, b: 20 },     
      { r: 0, g: 100, b: 0 }        
    ];
    
    const colorIndex = Math.floor(intensity * (baseColors.length - 1));
    const lowerColor = baseColors[colorIndex];
    const upperColor = baseColors[Math.min(colorIndex + 1, baseColors.length - 1)];
    
    const localIntensity = (intensity * (baseColors.length - 1)) - colorIndex;
    
    const r = Math.round(lowerColor.r + (upperColor.r - lowerColor.r) * localIntensity);
    const g = Math.round(lowerColor.g + (upperColor.g - lowerColor.g) * localIntensity);
    const b = Math.round(lowerColor.b + (upperColor.b - lowerColor.b) * localIntensity);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          justifyItems: "center",
        }}
      >
        {months.map((month) => (
          <div key={month} style={{ width: "250px" }}>
            <h2 style={{ textAlign: "center" }}>
              {new Date(2024, month).toLocaleString("default", { month: "long" })}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: "5px",
                marginBottom: "10px",
              }}
            >
              <div style={{ textAlign: "center" }}>Sun</div>
              <div style={{ textAlign: "center" }}>Mon</div>
              <div style={{ textAlign: "center" }}>Tue</div>
              <div style={{ textAlign: "center" }}>Wed</div>
              <div style={{ textAlign: "center" }}>Thu</div>
              <div style={{ textAlign: "center" }}>Fri</div>
              <div style={{ textAlign: "center" }}>Sat</div>
            </div>

            {getWeeksInMonth(month).map((week, weekIndex) => (
              <div
                key={weekIndex}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "5px",
                }}
              >
                {week.map((day, dayIndex) => {
                  if (!day) return <div key={dayIndex} style={{ width: "30px", height: "30px" }}></div>;
                  const count = aggregatedData[day]?.count || 0;
                  return (
                    <div
                      key={day}
                      onClick={() => handleDayClick(day)}
                      onMouseOver={(event) => handleMouseOver(day, event)}
                      onMouseLeave={handleMouseLeave}
                      style={{
                        width: "30px",
                        height: "30px",
                        backgroundColor: getColor(count),
                        border: "1px solid #ddd",
                        cursor: "pointer",
                      }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        ))}
      </div>

      {tooltip && (
        <div
          style={{
            position: "absolute",
            top: tooltipPosition.top + "px",
            left: tooltipPosition.left + "px",
            padding: "10px",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            borderRadius: "8px",
            maxWidth: "300px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0" }}>Song Information</h3>
          <p style={{ margin: "5px 0" }}>
            <strong>Date:</strong> {new Date(tooltip.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
          <p style={{ margin: "5px 0" }}>
            <strong>Top Song:</strong> {tooltip.song || "No data"}
          </p>
          <p style={{ margin: "5px 0" }}>
            <strong>Total Songs:</strong> {tooltip.totalSongs || 0}
          </p>
        </div>
      )}
    </div>
  );
};