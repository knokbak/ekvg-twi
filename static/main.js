/*
 * BSD 3-Clause License
 * Copyright (c) 2023, Ollie Killean
 * 
 * If a copy of the BSD 3-Clause License was not distributed with this file, you
 * may obtain one at: https://github.com/knokbak/ekvg-twi/blob/master/LICENSE.
 */

(() => {
    const lastConfirmedNotAFK = Date.now();
    let waitingTurnstilePromiseResolve = null;

    window.addEventListener('load', () => {
        turnstile.ready(async () => {
            await turnstile.render('#turnstile-widget', {
                sitekey: '0x4AAAAAAAOvE0Lkz-1FpBjo',
                execution: 'execute',
                callback: (token) => {
                    if (waitingTurnstilePromiseResolve) {
                        waitingTurnstilePromiseResolve(token);
                        waitingTurnstilePromiseResolve = null;
                    }
                },
            });
            refreshData();
        });
    });
    
    async function refreshData () {
        if (Date.now() - lastConfirmedNotAFK > 60_000 * 120) {
            alert('Are you still here? Press OK to continue using the TWI system.');
        }
    
        document.body.classList.add('loading');
        const turnstileToken = await getTurnstileToken();
    
        fetch('/api/status', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-Turnstile-Pass': turnstileToken,
            },
        }).then((x) => x.json()).then((data) => {
            document.getElementById('arr-rwy-30').classList.remove('light', 'medium', 'heavy', 'severe');
            document.getElementById('arr-rwy-30-waterfall').classList.remove('light', 'medium', 'heavy', 'severe');
            document.getElementById('dep-rwy-30').classList.remove('light', 'medium', 'heavy', 'severe');
            document.getElementById('arr-rwy-12').classList.remove('light', 'medium', 'heavy', 'severe');
            document.getElementById('dep-rwy-12').classList.remove('light', 'medium', 'heavy', 'severe');
            document.getElementById('dep-rwy-12-waterfall').classList.remove('light', 'medium', 'heavy', 'severe');
    
            document.getElementById('arr-rwy-30').classList.add(data.warnings.arriving30);
            document.getElementById('arr-rwy-30-waterfall').classList.add(data.warnings.arriving30Waterfall);
            document.getElementById('dep-rwy-30').classList.add(data.warnings.departing30);
            document.getElementById('arr-rwy-12').classList.add(data.warnings.arriving12);
            document.getElementById('dep-rwy-12').classList.add(data.warnings.departing12);
            document.getElementById('dep-rwy-12-waterfall').classList.add(data.warnings.departing12Waterfall);
    
            document.querySelector('#arr-rwy-30 p').innerText = toHumanReadable(data.warnings.arriving30);
            document.querySelector('#arr-rwy-30-waterfall p').innerText = toHumanReadable(data.warnings.arriving30Waterfall);
            document.querySelector('#dep-rwy-30 p').innerText = toHumanReadable(data.warnings.departing30);
            document.querySelector('#arr-rwy-12 p').innerText = toHumanReadable(data.warnings.arriving12);
            document.querySelector('#dep-rwy-12 p').innerText = toHumanReadable(data.warnings.departing12);
            document.querySelector('#dep-rwy-12-waterfall p').innerText = toHumanReadable(data.warnings.departing12Waterfall);
    
            document.getElementById('metar').innerText = data.raw.metar;
            document.getElementById('refreshing-in').innerText = 'Refreshing in 600 seconds';
            document.getElementById('refreshing-in').onclick = () => {
                alert(
                    `MODIFIER arriving12: ${data.modifiers.arriving12}\n` +
                    `MODIFIER departing12: ${data.modifiers.departing12}\n` +
                    `MODIFIER arriving30: ${data.modifiers.arriving30}\n` +
                    `MODIFIER departing30: ${data.modifiers.departing30}\n\n` +

                    `WINDS direction: ${data.winds.direction}\n` +
                    `WINDS speed: ${data.winds.speed}\n` +
                    `WINDS gust: ${data.winds.gust}\n\n` +

                    `SKEID direction: ${data.skeid.direction}\n` +
                    `SKEID speed: ${data.skeid.speed}\n` +
                    `SKEID gust: ${data.skeid.gust}\n\n` +

                    `RAW metar: ${data.raw.metar}\n` +
                    `RAW metarSource: ${data.raw.metarSource}\n` +
                    `RAW fromCache: ${data.raw.fromCache}`
                );
            }
    
            let counter = 0;
            let interval = setInterval(() => {
                counter++;
                if (counter === 600) {
                    document.getElementById('refreshing-in').innerText = '';
                    clearInterval(interval);
                    refreshData();
                    return;
                }
                document.getElementById('refreshing-in').innerText = 'Refreshing in ' + (600 - counter) + ' seconds';
            }, 1_000);
    
            document.body.classList.remove('loading');
        }).catch((err) => {
            alert(err);
            throw err;
        });
    }

    function getTurnstileToken () {
        const promise = new Promise((resolve) => {
            waitingTurnstilePromiseResolve = resolve;
        });
        turnstile.execute('#turnstile-widget');
        return promise;
    }
    
    function toHumanReadable (str) {
        switch (str) {
            case 'none': return 'NO WARNINGS';
            case 'light': return 'LIGHT TURBULENCE';
            case 'medium': return 'MODERATE TURBULENCE';
            case 'heavy': return 'MODERATE TO SEVERE TURBULENCE';
            case 'severe': return 'SEVERE TURBULENCE - RWY CLOSED';
            default: throw new Error('Unknown turbulence level: ' + str);
        }
    }
})();
