// Timezone configurations
const timezones = {
    'clock-ny': { name: 'America/New_York', label: 'New York' },
    'clock-london': { name: 'Europe/London', label: 'London' },
    'clock-dubai': { name: 'Asia/Dubai', label: 'Dubai' },
    'clock-india': { name: 'Asia/Kolkata', label: 'India' },
    'clock-singapore': { name: 'Asia/Singapore', label: 'Singapore' },
    'clock-tokyo': { name: 'Asia/Tokyo', label: 'Tokyo' },
    'clock-sydney': { name: 'Australia/Sydney', label: 'Sydney' },
    'clock-la': { name: 'America/Los_Angeles', label: 'Los Angeles' }
};

let use24HourFormat = true;

// Function to format time
function formatTime(date, use24Hour = true) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    if (use24Hour) {
        return `${hours}:${minutes}:${seconds}`;
    } else {
        let displayHours = date.getHours() % 12;
        displayHours = displayHours === 0 ? 12 : displayHours;
        const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
        return `${String(displayHours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
    }
}

// Function to get time in specific timezone
function getTimeInTimezone(timezoneName) {
    try {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezoneName,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        const parts = formatter.formatToParts(new Date());
        const time = parts.reduce((acc, part) => {
            if (part.type !== 'literal') {
                acc[part.type] = part.value;
            }
            return acc;
        }, {});

        if (!use24HourFormat) {
            let hours = parseInt(time.hour);
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12 || 12;
            return `${String(hours).padStart(2, '0')}:${time.minute}:${time.second} ${ampm}`;
        }
        
        return `${time.hour}:${time.minute}:${time.second}`;
    } catch (e) {
        return 'Invalid';
    }
}

// Update all clocks
function updateClocks() {
    const now = new Date();
    
    // Update timezone clocks
    Object.entries(timezones).forEach(([elementId, tzInfo]) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = getTimeInTimezone(tzInfo.name);
        }
    });
    
    // Update local time
    const localElement = document.getElementById('clock-local');
    if (localElement) {
        localElement.textContent = formatTime(now, use24HourFormat);
    }
}

// Toggle between 24/12 hour format
document.getElementById('toggle-format').addEventListener('click', function() {
    use24HourFormat = !use24HourFormat;
    this.textContent = `Switch to ${use24HourFormat ? '12' : '24'}-Hour Format`;
    updateClocks();
});

// Add custom timezone
document.getElementById('add-timezone').addEventListener('click', function() {
    const timezone = prompt('Enter timezone (e.g., Asia/Bangkok, Europe/Paris):');
    if (timezone) {
        try {
            // Test if timezone is valid
            new Intl.DateTimeFormat('en-US', { timeZone: timezone });
            
            // Create new clock card
            const gridContainer = document.querySelector('.clock-grid');
            const newCard = document.createElement('div');
            newCard.className = 'clock-card';
            
            const tzName = timezone.split('/')[1] || timezone;
            const newElementId = `clock-${tzName.toLowerCase()}`;
            
            newCard.innerHTML = `
                <div class="timezone-name">${tzName}</div>
                <div class="timezone-offset">Timezone: ${timezone}</div>
                <div class="digital-clock" id="${newElementId}"></div>
                <button style="margin-top: 10px; padding: 8px 15px; font-size: 0.9em;" onclick="this.parentElement.remove()">Remove</button>
            `;
            
            gridContainer.appendChild(newCard);
            timezones[newElementId] = { name: timezone, label: tzName };
            updateClocks();
        } catch (e) {
            alert('Invalid timezone! Please use valid timezone format (e.g., Asia/Bangkok)');
        }
    }
});

// Update clocks every second
setInterval(updateClocks, 1000);

// Initial update
updateClocks();

// Log initial message
console.log('Digital Clock loaded successfully!');
console.log('Available timezones:', Object.keys(timezones));
