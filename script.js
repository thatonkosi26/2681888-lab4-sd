document.getElementById('submit').addEventListener('click', function() {
    const countryName = document.getElementById('country-input').value.trim();

    if (countryName === "") {
        alert("Please enter a country name.");
        return;
    }

    // Clear previous content
    document.getElementById('country-info').innerHTML = '';
    document.getElementById('bordering-countries').innerHTML = '';

    // Fetch data from the REST Countries API
    fetch(`https://restcountries.com/v3.1/name/${countryName}?fullText=true`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Country not found');
            }
            return response.json();
        })
        .then(data => {
            const country = data[0]; // Assuming we get the data for a single country

            // Extract relevant country information
            const capital = country.capital ? country.capital[0] : 'N/A';
            const population = country.population.toLocaleString();
            const region = country.region;
            const flag = country.flags.svg;
            const borders = country.borders || [];

            // Display country information
            const countryInfoSection = document.getElementById('country-info');
            countryInfoSection.innerHTML = `
                <h2>${countryName}</h2>
                <p><strong>Capital:</strong> ${capital}</p>
                <p><strong>Population:</strong> ${population}</p>
                <p><strong>Region:</strong> ${region}</p>
                <p><strong>Flag:</strong></p>
                <img src="${flag}" alt="Flag of ${countryName}" width="100">
            `;

            // Display bordering countries if available
            if (borders.length > 0) {
                const borderingCountriesSection = document.getElementById('bordering-countries');
                borderingCountriesSection.innerHTML = '<h3>Bordering Countries:</h3>';
                
                borders.forEach(borderCode => {
                    fetch(`https://restcountries.com/v3.1/alpha/${borderCode}`)
                        .then(response => response.json())
                        .then(borderData => {
                            const borderCountry = borderData[0];
                            const borderName = borderCountry.name.common;
                            const borderFlag = borderCountry.flags.svg;

                            borderingCountriesSection.innerHTML += `
                                <section>
                                    <p><strong>${borderName}</strong></p>
                                    <img src="${borderFlag}" alt="Flag of ${borderName}" width="50">
                                </section>
                            `;
                        })
                        .catch(err => {
                            console.error("Error fetching border country data:", err);
                        });
                });
            }

        })
        .catch(error => {
            // Handle errors
            const countryInfoSection = document.getElementById('country-info');
            countryInfoSection.innerHTML = `<p style="color: red;">Error: ${error.message}. Please try again.</p>`;
        });
});
