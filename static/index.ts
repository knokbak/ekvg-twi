/*
 * BSD 3-Clause License
 * Copyright (c) 2023, Ollie Killean
 * 
 * If a copy of the BSD 3-Clause License was not distributed with this file, you
 * may obtain one at: https://github.com/knokbak/ekvg-twi/blob/master/LICENSE.
 */

export const HTML = `
<!DOCTYPE html>
<html lang="en-GB">
    <head>
        <meta charset="utf-8">
        <title>EKVG TWI - Turbulence Warning Indication System</title>
        <meta name="viewport" content="width=750px">
        <link rel="stylesheet" href="https://cdn.olli.ovh/twi.olli.ovh/styles/main.css">
    </head>
    <body class="loading">
        <div class="indicators-wrap">
            <div id="loader" class="spinner"></div>

            <div class="indicators-box">
                <div class="indicators">
                    <div id="arr-rwy-30" class="indicator">
                        <h3>ARR RWY 30</h3>
                        <p></p>
                    </div>
                    <div id="dep-rwy-30" class="indicator">
                        <h3>DEP RWY 30</h3>
                        <p></p>
                    </div>
                </div>
                <p class="indicators-identifier">RUNWAY 30</p>
            </div>

            <div class="indicators-box">
                <div class="indicators">
                    <div id="arr-rwy-12" class="indicator">
                        <h3>ARR RWY 12</h3>
                        <p></p>
                    </div>
                    <div id="dep-rwy-12" class="indicator">
                        <h3>DEP RWY 12</h3>
                        <p></p>
                    </div>
                </div>
                <p class="indicators-identifier">RUNWAY 12</p>
            </div>

            <div class="indicators-box">
                <div class="indicators">
                    <div id="arr-rwy-30-waterfall" class="indicator">
                        <h3>ARR WATERFALL 30</h3>
                        <p></p>
                    </div>
                    <div id="dep-rwy-12-waterfall" class="indicator">
                        <h3>DEP WATERFALL 12</h3>
                        <p></p>
                    </div>
                </div>
                <p class="indicators-identifier">WATERFALL</p>
            </div>
            
            <p id="metar"></p>
        </div>

        <hr />

        <h1>Turbulence Warning Indication (TWI) System</h1>
        <p>This is the TWI system for EKVG Vagar Airport on the <a href="https://vatsim.net" target="_blank">VATSIM</a> network.</p>
        <p>The TWI system uses data collected by the real-world operators of Vagar to predict the severity of turbulence on final approach. This software's dataset is based on the windroses published on the Danish AIP.</p>
        
        <hr />

        <h2>Using This System</h2>
        <p>The TWI system predicts turbulent conditions individually for both departures and arrivals.</p>
        <p>If the winds are gusting, the highest speed will be used. If the winds are variable, the system will display the worst case scenario. This is what they will follow in real life.</p>
        <p>
            <strong>NONE:</strong> No substantial turbulence is predicted.
            <br />
            <strong class="color-light">LIGHT:</strong> Light turbulence is predicted. There may be slight, erratic changes in attitude and/or altitude.
            <br />
            <strong class="color-medium">MEDIUM:</strong> Moderate turbulence is predicted. Variations in speed as well as altitude and attitude may occur but the aircraft remains in control all the time.
            <br />
            <strong class="color-heavy">HEAVY:</strong> Moderate to severe turbulence is predicted. Large variations in speed as well as altitude and attitude may occur. The aircraft remains under control.
            <br />
            <strong class="color-severe">SEVERE:</strong> Severe turbulence is predicted. Take-off and landing in the indicated configuration is prohibited. There may be large, abrupt changes in attitude and altitude with large variations in airspeed. There may be brief periods where effective control of the aircraft is impossible. Loose objects may move around the cabin and damage to aircraft structures may occur.
        </p>
        <p><strong>NOTE:</strong> The TWI system is designed for Cat M aircraft (such as the A320 and B737). Light aircraft are particularly vulnerable in turbulent conditions.</p>
        <p><strong>Note:</strong> TWI closes runways for take-offs and landings separately. This means a runway could be closed for take-offs, but available for landings, or vice-versa.</p>
        <p>This page will automatically refresh every 10 minutes. Every 2 hours, you will need to confirm you are still using the system.</p>

        <hr />

        <h2>How It Works</h2>
        <p>Over 30 years, the operators of Vagar have collected data and pilot reports which have allowed them to create multiple 'windroses' (charts that show turbulence severity in relation to wind heading and speed). These are used to program the real-world TWI and are the basis of this system as well.</p>
        <p>In real life, the TWI operates on a degree-by-degree basis, but this system uses 10 degree increments due to its use of METARs instead of direct access to a weather station. The real-world TWI also takes into account variations and gust frequency however, I do not have access to this data.</p>

        <h3>Arriving RWY 30, Departing RWY 12</h3>
        <div class="img-sim-wrap">
            <img src="https://cdn.olli.ovh/twi.olli.ovh/images/arr30-dep12.png" alt="Windrose showing turbulance severity for arrivals to runway 30, and departures from runway 12" />
        </div>

        <h3>Arriving RWY 12, Departing RWY 30</h3>
        <div class="img-sim-wrap">
            <img src="https://cdn.olli.ovh/twi.olli.ovh/images/arr12-dep30.png" alt="Windrose showing turbulance severity for arrivals to runway 12, and departures from runway 30" />
        </div>

        <h3>Arriving Waterfall RWY 30, Departing Waterfall RWY 12</h3>
        <p>VFR flights, and IFR flights following an RNP AR procedure, can depart or arrive via a special route which takes them between two hills. These procedures have their own risks and windroses regarding turbulence so have their own TWI indicators.</p>
        <div class="img-sim-wrap">
            <img src="https://cdn.olli.ovh/twi.olli.ovh/images/waterfall.png" alt="Windrose showing turbulance severity for arrivals and departures using the waterfall procedures" />
        </div>

        <h3>Handling Variable Winds</h3>
        <p>If the winds at Skeid are variable, the system will calculate the severity for every 10-degree increment. For every 10 degrees away from the centre, the wind speed will be reduced by 2 knots (which is to handle simulator inaccuracies). The system will then use the highest severity result.</p>
        <p>As an example, below is a calculation for the winds <strong>26017G30KT 220V300</strong>. The system identifies the severity as <strong class="color-heavy">HEAVY</strong>.</p>
        <div class="img-sim-wrap">
            <img src="https://cdn.olli.ovh/twi.olli.ovh/images/calculating-variable-severity.png" alt="Windrose showing turbulance severity for variable winds" />
        </div>

        <hr />

        <p><strong>FOR SIMULATION USE ONLY</strong></p>

        <p>
            Provided and maintained by Ollie - 1553864
            <br />
            Discord: <a href="https://discord.com/channels/@me/534479985855954965">olli.ovh</a> or <a href="https://discord.com/channels/182554696559362048/207181274044039169">#icelandic-chat</a>
        </p>

        <span id="refreshing-in"></span>
        <div id="turnstile-widget"></div>

        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>
        <script src="https://cdn.olli.ovh/twi.olli.ovh/scripts/main.js"></script>
    </body>
</html>
`;
