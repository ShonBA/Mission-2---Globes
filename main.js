// <reference path ="jquery.js"/> 
$(() => {
    const searchTextBox = document.getElementById("searchTextBox");
    const statisticsContainer = document.getElementById("statisticsContainer");
    const mainContainer = document.getElementById("mainContainer");
    const regionContainer = document.getElementById("regionContainer");
    const currenciesContainer = document.getElementById("currenciesContainer");
    const container = document.getElementById("container");
    let regions = new Map();
    let currencies = new Map();



    $("#allBtn").click(async function () {
        try {
            showSpinner();
            clearHtml();
            const allData = await getJson(`https://restcountries.com/v3.1/all`);
            statisticsDisplay(allData);
            regionAndCountriesDisplay(allData);
        } catch (err) {
            console.log(`Error Occurred in click in All Button`);
        } finally {
            stopSpinner();
        }
    })

    $(`#seatchBtn`).click(async function () {
        const searchVal = searchTextBox.value;
        try {
            showSpinner()
            clearHtml()
            const searchData = await getJson(`https://restcountries.com/v3.1/name/${searchVal}`);
                statisticsDisplay(searchData);
                countriesAndPopDisplay(searchData);
                regionAndCountriesDisplay(searchData);
                currenciesDisplay(searchData);

        } catch (err) {
            console.log(`Error Occurred in click in Search Button, ${err}`);
        } finally {
            stopSpinner();
        }
    })



    function regionAndCountriesDisplay(countries) {
        checkRegionCount(countries)
        let html = `
    <table class="table table-dark table-striped text-center">
        <thead>
            <tr>
                <th>Region</th>
                <th>Number of countries</th>
            </tr>
        </thead>
        <tbody>
    `
        regions.forEach((value, key) => {
            if (value !== 0) {
                html += `
            <tr>
            <td>${key}</td>
            <td>${value}</td>
            </tr>
            `
            }
        });

        html += `
        </tbody>
    </table>
    `
        regionContainer.innerHTML = html;
        regions.clear()
    }


    function checkRegionCount(countries) {
        for (const country of countries) {
            if (regions.has(country.region)) {
                regions.set(country.region, regions.get(country.region) + 1);
            } else {
                regions.set(country.region, 1);
            }
        }
        return regions
    }

    // -------------------------------------------------------------------------------------

    function countriesAndPopDisplay(countries) {      
        let countCountries = 1;
        let html = `
        <table class="table table-dark table-striped text-center">
            <thead>
                <tr>
                    <th>Country Flag</th>
                    <th>Country Name</th>
                    <th>Number of citizens</th>
                </tr>
            </thead>
            <tbody>
        `
        for (const state of countries) {
            html += `
                <tr>
                    <td><img src="${state.flags.png}" alt="${state.name.common}" class="flags"></td>
                    <td>${state.name.official}</td>
                    <td>${state.population}</td>
                </tr>
                `
            countCountries++
        }

        html += `
            </tbody>
        </table>
        `
        mainContainer.innerHTML = html;
    }

    // -------------------------------------------------------------------------------------

    function statisticsDisplay(countries) {
        console.log(countries)
        if(countries.message === `Not Found` || countries.message === `Page Not Found`){
            statisticsContainer.innerHTML = `No Country has been found`
        }
        let sumPop = 0
        let countriesCounter = 0
        for (const state of countries) {
            sumPop += state.population
            countriesCounter++
        }
        const avgPop = sumPop / countriesCounter

        statisticsContainer.innerHTML = `
        Number of countries: ${countriesCounter} <br>
        Total Countries Population: ${sumPop} <br>
        Average Population: ${Math.floor(avgPop)}
        `
    }

    // -------------------------------------------------------------------------------------

    async function getJson(url) {
        const response = await fetch(url);
        const json = response.json();
        return json;
    }

    // -------------------------------------------------------------------------------------


    function currenciesDisplay(countries) {
        checkCurrenciesCount(countries)
        let html = `
    <table class="table table-dark table-striped text-center">
        <thead>
            <tr>
                <th>Currency</th>
                <th>Countries using currency</th>
            </tr>
        </thead>
        <tbody>
    `
        currencies.forEach((value, key) => {
            console.log(`${key} = ${value}`);
            if (value !== 0) {
                html += `
            <tr>
            <td>${key}</td>
            <td>${value}</td>
            </tr>
            `
            }
        });

        html += `
        </tbody>
    </table>
    `
        currenciesContainer.innerHTML = html;
        currencies.clear()
    }


    function checkCurrenciesCount(countries) {
        for (const item of countries) {
            for (const prop in item.currencies) {
                console.log(prop);
                if (currencies.has(prop)) {
                    currencies.set(prop, currencies.get(prop) + 1);
                } else {
                    currencies.set(prop, 1);
                }
            }
        }
    }

    // -------------------------------------------------------------------------------------

    function clearHtml() {
        statisticsContainer.innerHTML = ""
        mainContainer.innerHTML = ""
        regionContainer.innerHTML = ""
        currenciesContainer.innerHTML = ""
    }

    function showSpinner() {
        document.getElementById("loader").style.display = "";
    }
    function stopSpinner() {
        document.getElementById("loader").style.display = "none";
    }

})
