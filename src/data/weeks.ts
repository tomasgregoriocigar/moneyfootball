// MoneyFootball board archive data.
// Every number in this file comes from the records on file: the committed
// public/data/slate_verdict.json boards (git history), the week settlement
// files, and the calibration snapshots in the project workspace. Nothing is
// reconstructed. Week 5 per-pick outcomes were not recorded (aggregate only);
// Weeks 1-4 survive only as the 23-11 aggregate.

export interface BoardRow {
  player: string;
  team: string;
  opponent: string;
  verdict: string | null;
  tier: string | null;
  ask: number;
  fv: number;
  edge: number;
  itt: number | null;
}

export interface ResultRow {
  player: string;
  result: string;
  closing: string | null;
  note: string;
}

export interface WeekArchive {
  week: number;
  board: BoardRow[];
  results: ResultRow[] | null;
  boardTitle: string;
  boardIntro: string;
  resultsTitle: string;
  resultsIntro: string;
  weekLine: string;
  seasonLine: string;
  allTimeLine: string | null;
  sniperLine: string | null;
  bandNote: string | null;
}

export const WEEKS: WeekArchive[] = [
  {
    week: 5,
    board: [
    { player: 'Chase Brown', team: 'CIN', opponent: 'MIA', verdict: null, tier: 'HIGH', ask: 0.36, fv: 0.482, edge: 0.122, itt: 24.5 },
    { player: 'Trey McBride', team: 'ARI', opponent: 'DET', verdict: null, tier: 'HIGH', ask: 0.38, fv: 0.465, edge: 0.085, itt: 24.5 },
    { player: 'Dontayvion Wicks', team: 'GB', opponent: 'CHI', verdict: null, tier: 'MEDIUM', ask: 0.3, fv: 0.384, edge: 0.084, itt: 23.5 },
    { player: 'Juwan Johnson', team: 'NO', opponent: 'ATL', verdict: null, tier: 'MEDIUM', ask: 0.3, fv: 0.376, edge: 0.076, itt: 21.0 },
    ],
    results: null,
    boardTitle: 'NFL Week 5 Anytime Touchdown Picks — MoneyFootball Board',
    boardIntro: 'The first MoneyFootball board committed to this site (October 13, 2026): 4 anytime touchdown targets with the model fair value and Kalshi price shown for each pick as published. The Week 5 file predates the BUY/PASS verdict field, so all four are listed as published targets, exactly as they ran.',
    resultsTitle: 'NFL Week 5 Anytime TD Picks Results — MoneyFootball Settlement',
    resultsIntro: 'Week 5 settled 1-3 in aggregate. Per-pick outcomes were not recorded for this week — the settlement survives only as the aggregate in the commit record ("Week 5 settlements 1-3") — so no hit or miss is assigned to any individual pick below. The board is shown as published.',
    weekLine: 'Week 5 verdicts: 1-3 (aggregate only; per-pick outcomes not recorded).',
    seasonLine: 'Season record: 23-11 → 24-14 after Week 5.',
    allTimeLine: null,
    sniperLine: null,
    bandNote: null,
  },
  {
    week: 6,
    board: [
    { player: 'Kenneth Walker III', team: 'KC', opponent: 'LAC', verdict: 'BUY', tier: 'HIGH', ask: 0.62, fv: 0.84, edge: 0.22, itt: 25.5 },
    { player: 'Rhamondre Stevenson', team: 'NE', opponent: 'NYJ', verdict: 'BUY', tier: 'HIGH', ask: 0.63, fv: 0.828, edge: 0.198, itt: 25.0 },
    { player: 'Jonathan Taylor', team: 'IND', opponent: 'TEN', verdict: 'BUY', tier: 'HIGH', ask: 0.71, fv: 0.84, edge: 0.13, itt: 25.5 },
    { player: 'Kyren Williams', team: 'LAR', opponent: 'ARI', verdict: 'BUY', tier: 'HIGH', ask: 0.67, fv: 0.885, edge: 0.215, itt: 32.5 },
    { player: 'Javonte Williams', team: 'DAL', opponent: 'GB', verdict: 'BUY', tier: 'HIGH', ask: 0.66, fv: 0.814, edge: 0.154, itt: 25.5 },
    { player: 'MarShawn Lloyd', team: 'GB', opponent: 'DAL', verdict: 'PASS', tier: 'HIGH', ask: 0.58, fv: 0.745, edge: 0.165, itt: 27.0 },
    ],
    results: [
    { player: 'Kenneth Walker III', result: 'HIT', closing: null, note: 'Scored — 2 TDs.' },
    { player: 'Rhamondre Stevenson', result: 'MISS', closing: null, note: 'No TD.' },
    { player: 'Jonathan Taylor', result: 'HIT', closing: null, note: 'Scored — 1 TD.' },
    { player: 'Kyren Williams', result: 'MISS', closing: null, note: 'No TD (the Rams scored 16).' },
    { player: 'Javonte Williams', result: 'HIT', closing: null, note: 'Scored — 1 TD.' },
    { player: 'MarShawn Lloyd', result: 'PASS CORRECT', closing: null, note: 'Did not score — the PASS was correct.' },
    ],
    boardTitle: 'NFL Week 6 Anytime Touchdown Picks — MoneyFootball Board',
    boardIntro: 'The MoneyFootball Week 6 board, final version as committed October 16, 2026: 6 anytime touchdown picks (5 BUY, 1 PASS) with the Kalshi price and model fair value shown for each pick as published.',
    resultsTitle: 'NFL Week 6 Anytime TD Picks Results — MoneyFootball Settlement',
    resultsIntro: 'Week 6 settled from verified box scores (calibration snapshot, October 19, 2026). The five BUYs went 3-2 and the MarShawn Lloyd PASS was correct.',
    weekLine: 'Week 6: BUYs 3-2; verdicts 4-2.',
    seasonLine: 'Season record: 24-14 → 28-16 (63.6%) after Week 6.',
    allTimeLine: 'All-time record after Week 6: 341-179.',
    sniperLine: null,
    bandNote: 'Calibration note from the settlement record: all five BUYs sat in the 0.80+ fair-value bucket (mean claimed fair value 0.841) and realized 3 of 5 (60%). One week, n=5 — recorded as a signal to test, not a basis to change the model.',
  },
  {
    week: 7,
    board: [
    { player: 'Kenneth Walker III', team: 'KC', opponent: 'SEA', verdict: 'BUY', tier: 'HIGH', ask: 0.56, fv: 0.851, edge: 0.291, itt: 20.0 },
    { player: 'Chuba Hubbard', team: 'CAR', opponent: 'TB', verdict: 'BUY', tier: 'HIGH', ask: 0.56, fv: 0.783, edge: 0.223, itt: 24.0 },
    { player: 'Kyren Williams', team: 'LAR', opponent: 'LV', verdict: 'BUY', tier: 'HIGH', ask: 0.6, fv: 0.799, edge: 0.199, itt: 26.0 },
    { player: 'Christian McCaffrey', team: 'SF', opponent: 'ATL', verdict: 'BUY', tier: 'HIGH', ask: 0.71, fv: 0.87, edge: 0.16, itt: 26.5 },
    { player: 'Derrick Henry', team: 'BAL', opponent: 'CIN', verdict: 'BUY', tier: 'HIGH', ask: 0.72, fv: 0.877, edge: 0.157, itt: 26.5 },
    { player: 'Jahmyr Gibbs', team: 'DET', opponent: 'GB', verdict: 'BUY', tier: 'HIGH', ask: 0.76, fv: 0.91, edge: 0.15, itt: 28.25 },
    { player: 'Aaron Jones Sr.', team: 'MIN', opponent: 'IND', verdict: 'PASS', tier: 'HIGH', ask: 0.62, fv: 0.418, edge: -0.202, itt: 24.0 },
    ],
    results: [
    { player: 'Kenneth Walker III', result: 'MISS', closing: null, note: '14 carries for 36 yards, 4 catches for 21; Kansas City lost 20-3 at Seattle and never reached the red zone.' },
    { player: 'Chuba Hubbard', result: 'MISS', closing: null, note: '7 carries for 33 yards, 4 catches for 27; Carolina lost 13-43 vs Tampa Bay. Mid-game steam to 89 cents was a mirage.' },
    { player: 'Kyren Williams', result: 'HIT', closing: null, note: '16 carries, 99 yards, 1 TD (17-yard TD); the Rams won 35-21 at Las Vegas.' },
    { player: 'Christian McCaffrey', result: 'HIT', closing: null, note: '1 rush TD (fourth-and-goal leap in the first quarter); San Francisco lost 20-29 at Atlanta.' },
    { player: 'Derrick Henry', result: 'MISS', closing: null, note: '17 carries, 45 yards, 0 TD; Baltimore lost 13-35 vs Cincinnati with Tyler Huntley at QB (Lamar Jackson out).' },
    { player: 'Jahmyr Gibbs', result: 'MISS', closing: null, note: '29 carries, 116 yards, 0 TD — slid down twice at the goal line to kill the clock; Detroit won 20-17.' },
    { player: 'Aaron Jones Sr.', result: 'PASS CORRECT', closing: null, note: 'Minnesota’s only TD was a Murray-to-Hockenson pass; Jones scoreless (aggravated knee).' },
    ],
    boardTitle: 'NFL Week 7 Anytime Touchdown Picks — MoneyFootball Board',
    boardIntro: 'The MoneyFootball Week 7 board for the games of Sunday, October 25, 2026: 7 anytime touchdown picks (6 BUY, 1 PASS), all HIGH confidence, with the Kalshi price and published fair value shown for each pick as published.',
    resultsTitle: 'NFL Week 7 Anytime TD Picks Results — MoneyFootball Settlement',
    resultsIntro: 'Week 7 settled Monday, October 26, 2026 from box scores. The six BUYs went 2-4 and the Aaron Jones Sr. PASS was correct. The losses are listed with the wins, same as every week.',
    weekLine: 'Week 7: BUYs 2-4; verdicts 3-4.',
    seasonLine: 'Season record: 28-16 → 31-20 (60.8%) after Week 7.',
    allTimeLine: 'All-time record: 341-179 → 344-183 (527 settled) after Week 7.',
    sniperLine: 'Sniper HIGH through Week 7: 14/23 = 60.9% as recorded in the settlement file (14/22 = 63.6% if the Week 2 CeeDee Lamb row was not HIGH).',
    bandNote: 'Calibration note from the settlement record: the 0.78-0.91 fair-value bucket realized 2 of 6 BUYs this week, echoing the Week 6 caution on top-end precision. Miss drivers: a QB-absence offense collapse (Henry), a defense game-plan shutout (Walker III), clock-kill slides at the goal line (Gibbs), and a blowout game script (Hubbard).',
  },
  {
    week: 8,
    board: [
    { player: 'Kenneth Walker III', team: 'KC', opponent: 'DEN', verdict: 'BUY', tier: 'HIGH', ask: 0.58, fv: 0.797, edge: 0.217, itt: 21.5 },
    { player: 'Omarion Hampton', team: 'LAC', opponent: 'LAR', verdict: 'BUY', tier: 'HIGH', ask: 0.34, fv: 0.541, edge: 0.201, itt: 18.5 },
    { player: 'Kyren Williams', team: 'LAR', opponent: 'LAC', verdict: 'BUY', tier: 'HIGH', ask: 0.58, fv: 0.767, edge: 0.187, itt: 26.0 },
    { player: 'Chuba Hubbard', team: 'CAR', opponent: 'GB', verdict: 'BUY', tier: 'HIGH', ask: 0.52, fv: 0.704, edge: 0.184, itt: 22.0 },
    { player: 'Ashton Jeanty', team: 'LV', opponent: 'NYJ', verdict: 'BUY', tier: 'HIGH', ask: 0.51, fv: 0.717, edge: 0.207, itt: 21.5 },
    { player: 'CeeDee Lamb', team: 'DAL', opponent: 'ARI', verdict: 'BUY', tier: 'HIGH', ask: 0.53, fv: 0.68, edge: 0.15, itt: 30.5 },
    { player: 'George Pickens', team: 'DAL', opponent: 'ARI', verdict: 'BUY', tier: 'HIGH', ask: 0.44, fv: 0.597, edge: 0.157, itt: 30.5 },
    { player: 'Jahmyr Gibbs', team: 'DET', opponent: 'MIN', verdict: 'BUY', tier: 'HIGH', ask: 0.73, fv: 0.846, edge: 0.116, itt: 25.0 },
    { player: 'Trey McBride', team: 'ARI', opponent: 'DAL', verdict: 'BUY', tier: 'HIGH', ask: 0.49, fv: 0.619, edge: 0.129, itt: 24.0 },
    { player: 'Javonte Williams', team: 'DAL', opponent: 'ARI', verdict: 'BUY', tier: 'HIGH', ask: 0.73, fv: 0.87, edge: 0.14, itt: 30.5 },
    { player: 'Josh Allen', team: 'BUF', opponent: 'BAL', verdict: 'BUY', tier: 'MEDIUM', ask: 0.62, fv: 0.718, edge: 0.098, itt: 28.5 },
    { player: 'Bijan Robinson', team: 'ATL', opponent: 'TB', verdict: 'BUY', tier: 'HIGH', ask: 0.63, fv: 0.774, edge: 0.144, itt: 22.0 },
    { player: 'Josh Jacobs', team: 'GB', opponent: 'CAR', verdict: 'PASS', tier: 'HIGH', ask: 0.57, fv: 0.364, edge: -0.206, itt: 25.5 },
    ],
    results: [
    { player: 'Kenneth Walker III', result: 'MISS', closing: 'n/a', note: '21/69/0 rushing, 4/15/0 receiving; Denver won 28-24. Stopped at the 1-yard line twice on Kansas City’s final drive.' },
    { player: 'Omarion Hampton', result: 'MISS', closing: '100¢', note: '9/20/0, 2/7/0; the Chargers scored zero touchdowns (3 field goals) in a 9-24 loss. The final 100-cent watch print contradicts the box score and is treated as a bad print; the box score governs.' },
    { player: 'Kyren Williams', result: 'HIT', closing: '100¢', note: '16/56/1 — 1-yard TD late in the second quarter; the Rams won 24-9.' },
    { player: 'Chuba Hubbard', result: 'HIT', closing: 'n/a', note: '1-yard TD in the second quarter on Thursday night; Carolina lost 19-27 at Green Bay.' },
    { player: 'Ashton Jeanty', result: 'MISS', closing: '79¢', note: 'Benched for the first quarter by his head coach after midweek comments about the Jets’ defense; Mike Washington Jr. took 25 carries. Jeanty: 2/9/0 rushing, 3/64/0 receiving.' },
    { player: 'CeeDee Lamb', result: 'MISS', closing: '11¢', note: '7/58/0; Dallas lost 30-33 in OT. Dallas TDs: a Prescott rush, Flournoy, and a fumble recovery.' },
    { player: 'George Pickens', result: 'MISS', closing: '83¢', note: '2/48/0 in the same OT loss.' },
    { player: 'Jahmyr Gibbs', result: 'HIT', closing: '100¢', note: '23/153/1 — 30-yard TD; Detroit handed unbeaten Minnesota its first loss, 19-15.' },
    { player: 'Trey McBride', result: 'HIT', closing: '98¢', note: '7/72/1 in Arizona’s 33-30 OT comeback.' },
    { player: 'Javonte Williams', result: 'MISS', closing: '21¢', note: '24/56/0 — and the cruel one: he fumbled at the Arizona 2 and a teammate fell on it in the end zone for Dallas’ TD instead.' },
    { player: 'Josh Allen', result: 'HIT', closing: '100¢', note: '1-yard rush TD in the first quarter (7/30/1 rushing, 289 pass yards, 2 pass TD); Buffalo routed Baltimore 36-10. MEDIUM tier — excluded from Sniper.' },
    { player: 'Bijan Robinson', result: 'MISS', closing: '86¢', note: '19/76/0, 0 catches; Atlanta shut out 0-16 in a Tampa rainstorm.' },
    { player: 'Josh Jacobs', result: 'PASS CORRECT', closing: 'n/a', note: 'Scoreless Thursday vs Carolina; Green Bay’s goal-line work stayed with MarShawn Lloyd, exactly the published PASS logic.' },
    ],
    boardTitle: 'NFL Week 8 Anytime Touchdown Picks — MoneyFootball Board',
    boardIntro: 'The MoneyFootball Week 8 board, as committed October 28, 2026: 13 anytime touchdown picks (12 BUY, 1 PASS) with the Kalshi price and published fair value shown for each pick as published. Fair values from this week on are published post-shrinkage (FV_pub = ask + 0.70 × (model FV − ask)).',
    resultsTitle: 'NFL Week 8 Anytime TD Picks Results — MoneyFootball Settlement',
    resultsIntro: 'Week 8 settled Monday, November 2, 2026 from box scores (cross-checked across multiple sources). The twelve BUYs went 5-7 and the Josh Jacobs PASS was correct. Closing ask is the last price-watch observation before settlement, not a settlement print.',
    weekLine: 'Week 8: BUYs 5-7; verdicts 6-7.',
    seasonLine: 'Season record: 31-20 → 37-27 (57.8%) after Week 8.',
    allTimeLine: 'All-time record: 344-183 → 350-190 (540 settled, 64.8%) after Week 8.',
    sniperLine: 'Sniper HIGH through Week 8: 19/35 = 54.3% (HIGH-confidence verdicts only; the Josh Allen hit was MEDIUM and does not count).',
    bandNote: 'Calibration note from the settlement record: the top band stayed soft — published fair values .767-.870 went 2-3 (Kyren Williams and Jahmyr Gibbs hit; Kenneth Walker III, Javonte Williams and Bijan Robinson missed). The week’s misses were dominated by non-model events: a coach’s benching (Jeanty), a fumble at the 2 recovered by a teammate (Javonte Williams), a goal-line stand at the 1 (Walker III), a zero-TD team game (Hampton), and a weather game (Robinson).',
  },
  {
    week: 9,
    board: [
    { player: 'Kenneth Walker III', team: 'KC', opponent: 'NYJ', verdict: 'BUY', tier: 'HIGH', ask: 0.68, fv: 0.868, edge: 0.188, itt: 28.5 },
    { player: 'Tyler Shough', team: 'NO', opponent: 'CLE', verdict: 'BUY', tier: 'HIGH', ask: 0.2, fv: 0.453, edge: 0.253, itt: 22.75 },
    { player: 'Omarion Hampton', team: 'LAC', opponent: 'HOU', verdict: 'BUY', tier: 'HIGH', ask: 0.28, fv: 0.507, edge: 0.227, itt: 17.5 },
    { player: 'T.J. Hockenson', team: 'MIN', opponent: 'BUF', verdict: 'BUY', tier: 'HIGH', ask: 0.32, fv: 0.646, edge: 0.326, itt: 20.75 },
    { player: 'Kyle Pitts', team: 'ATL', opponent: 'CIN', verdict: 'BUY', tier: 'HIGH', ask: 0.26, fv: 0.565, edge: 0.305, itt: 24.75 },
    { player: 'Sam LaPorta', team: 'DET', opponent: 'MIA', verdict: 'BUY', tier: 'HIGH', ask: 0.33, fv: 0.602, edge: 0.272, itt: 28.5 },
    { player: 'Brock Bowers', team: 'LV', opponent: 'SF', verdict: 'BUY', tier: 'HIGH', ask: 0.45, fv: 0.637, edge: 0.187, itt: 21.0 },
    { player: 'Jonathan Taylor', team: 'IND', opponent: 'DAL', verdict: 'BUY', tier: 'HIGH', ask: 0.56, fv: 0.743, edge: 0.183, itt: 23.0 },
    { player: 'Kyren Williams', team: 'LAR', opponent: 'WAS', verdict: 'BUY', tier: 'HIGH', ask: 0.59, fv: 0.781, edge: 0.191, itt: 26.5 },
    { player: 'Chuba Hubbard', team: 'CAR', opponent: 'DEN', verdict: 'BUY', tier: 'HIGH', ask: 0.53, fv: 0.713, edge: 0.183, itt: 21.0 },
    { player: 'Javonte Williams', team: 'DAL', opponent: 'IND', verdict: 'BUY', tier: 'HIGH', ask: 0.67, fv: 0.843, edge: 0.173, itt: 28.5 },
    { player: 'Mike Gesicki', team: 'CIN', opponent: 'ATL', verdict: 'BUY', tier: 'HIGH', ask: 0.3, fv: 0.469, edge: 0.169, itt: 27.75 },
    { player: 'Ollie Gordon II', team: 'MIA', opponent: 'DET', verdict: 'BUY', tier: 'HIGH', ask: 0.47, fv: 0.63, edge: 0.16, itt: 22.0 },
    { player: 'George Kittle', team: 'SF', opponent: 'LV', verdict: 'BUY', tier: 'HIGH', ask: 0.55, fv: 0.71, edge: 0.16, itt: 30.5 },
    { player: 'Colston Loveland', team: 'CHI', opponent: 'TB', verdict: 'BUY', tier: 'HIGH', ask: 0.38, fv: 0.51, edge: 0.13, itt: 26.75 },
    { player: 'Jaxon Smith-Njigba', team: 'SEA', opponent: 'ARI', verdict: 'BUY', tier: 'HIGH', ask: 0.55, fv: 0.675, edge: 0.125, itt: 24.0 },
    { player: 'Bijan Robinson', team: 'ATL', opponent: 'CIN', verdict: 'BUY', tier: 'HIGH', ask: 0.71, fv: 0.823, edge: 0.113, itt: 24.75 },
    { player: 'Jahmyr Gibbs', team: 'DET', opponent: 'MIA', verdict: 'BUY', tier: 'HIGH', ask: 0.78, fv: 0.885, edge: 0.105, itt: 28.5 },
    { player: 'Josh Allen', team: 'BUF', opponent: 'MIN', verdict: 'BUY', tier: 'HIGH', ask: 0.53, fv: 0.639, edge: 0.109, itt: 23.75 },
    { player: 'Ja\'Marr Chase', team: 'CIN', opponent: 'ATL', verdict: 'BUY', tier: 'MEDIUM', ask: 0.51, fv: 0.588, edge: 0.078, itt: 27.75 },
    { player: 'Amon-Ra St. Brown', team: 'DET', opponent: 'MIA', verdict: 'BUY', tier: 'MEDIUM', ask: 0.52, fv: 0.586, edge: 0.066, itt: 28.5 },
    { player: 'Travis Kelce', team: 'KC', opponent: 'NYJ', verdict: 'PASS', tier: 'HIGH', ask: 0.41, fv: 0.123, edge: -0.287, itt: 28.5 },
    ],
    results: [
    { player: 'Kenneth Walker III', result: 'HIT', closing: '100¢', note: 'Three touchdowns: 7-yard and 25-yard TD catches and a 2-yard rush TD. 18 carries, 102 rush yards; 4 catches, 41 yards. Kansas City won 35-12.' },
    { player: 'Tyler Shough', result: 'MISS', closing: '93¢', note: 'Threw the overtime game-winning TD pass but never scored himself: 21/35, 265 pass yards, 1 pass TD; 10 rushes, 51 yards, 0 rush TD. New Orleans won 23-22 in OT. Ran to 93 cents live; the box score governs.' },
    { player: 'Omarion Hampton', result: 'MISS', closing: '5¢', note: '13 carries, 60 yards, 0 TD, no targets. The Chargers lost 22-44.' },
    { player: 'T.J. Hockenson', result: 'MISS', closing: 'n/a', note: '4 catches on 7 targets, 33 yards, 0 TD. A third-quarter deep shot to him was intercepted at the Buffalo 11. Minnesota lost 6-23.' },
    { player: 'Kyle Pitts', result: 'MISS', closing: 'n/a', note: '3 catches, 23 yards, 0 TD in Madrid. Atlanta lost 17-34.' },
    { player: 'Sam LaPorta', result: 'MISS', closing: '25¢', note: '4 catches, 32 yards, 0 TD. Detroit’s only TD was a Jahmyr Gibbs run; Jared Goff threw no TD passes. Detroit won 19-9.' },
    { player: 'Brock Bowers', result: 'HIT', closing: '100¢', note: '21-yard TD catch. 7 catches, 111 yards (also lost a fumble). Las Vegas lost 17-38.' },
    { player: 'Jonathan Taylor', result: 'MISS', closing: '87¢', note: '13 carries, 46 yards, 0 TD; 5 catches, 18 yards; lost a fourth-quarter fumble. Indianapolis’ rushing TD went to Seth McGowan. Indianapolis lost 23-27.' },
    { player: 'Kyren Williams', result: 'MISS', closing: '14¢', note: '15 carries, 45 yards, 0 TD; 3 catches, 16 yards. Blake Corum took the Rams’ rushing TD. The Rams won 20-13.' },
    { player: 'Chuba Hubbard', result: 'MISS', closing: '86¢', note: '16 carries, 79 yards, 0 TD; 4 catches, 17 yards. Near miss: first-and-goal at the 1 in the third quarter; his second-down carry from the 1 was wiped off the record when Denver’s challenge turned the preceding play into an interception. Carolina lost 21-26.' },
    { player: 'Javonte Williams', result: 'HIT', closing: '26¢', note: 'Game-winning 1-yard TD with 1:08 left. 20 carries, 101 yards. Dallas won 27-23.' },
    { player: 'Mike Gesicki', result: 'MISS', closing: '12¢', note: '2 catches, 11 yards, 0 TD. His three-game TD streak ended. Cincinnati won 34-17.' },
    { player: 'Ollie Gordon II', result: 'MISS', closing: '92¢', note: '16 carries, 55 yards, 0 TD; 1 catch, 9 yards. Miami scored zero touchdowns (three field goals). Miami lost 9-19.' },
    { player: 'George Kittle', result: 'MISS', closing: '5¢', note: '4 catches, 58 yards, 0 TD. San Francisco won 38-17; the scores went elsewhere.' },
    { player: 'Colston Loveland', result: 'MISS', closing: '91¢', note: '4 catches, 54 yards, 0 TD. A 38-yard catch in the final minute set up the walk-off field goal on Sunday night, but he never scored. Chicago won 27-24.' },
    { player: 'Jaxon Smith-Njigba', result: 'MISS', closing: 'n/a', note: '7 catches, 51 yards, 0 TD. Both Seattle TDs went to AJ Barner (one rush, one catch). Seattle won 17-3.' },
    { player: 'Bijan Robinson', result: 'HIT', closing: '98¢', note: '1-yard rush TD in the third quarter. 19 carries, 100 yards; 6 catches, 47 yards. Atlanta lost 17-34.' },
    { player: 'Jahmyr Gibbs', result: 'HIT', closing: '100¢', note: '8-yard rush TD in the third quarter. 20 carries, 74 yards. Detroit won 19-9.' },
    { player: 'Josh Allen', result: 'MISS', closing: 'n/a', note: '21/31, 234 pass yards, 1 pass TD, 1 INT; 6 rushes, 15 yards, 0 rush TD on Monday night. Buffalo won 23-6.' },
    { player: 'Ja\'Marr Chase', result: 'HIT', closing: '100¢', note: '47-yard TD catch. 10 catches, 155 yards. Cincinnati won 34-17.' },
    { player: 'Amon-Ra St. Brown', result: 'MISS', closing: 'n/a', note: '8 catches, 86 yards, 0 TD. Detroit won 19-9.' },
    { player: 'Travis Kelce', result: 'PASS INCORRECT', closing: '100¢', note: 'Scored anyway: a 1-yard rush TD on a Patrick Mahomes lateral ruled a backward pass; 4 catches, 72 yards. Kansas City won 35-12. The fade was wrong and is posted as a loss.' },
    ],
    boardTitle: 'NFL Week 9 Anytime Touchdown Picks — MoneyFootball Board',
    boardIntro: 'The MoneyFootball Week 9 board, published Friday, November 6, 2026: 22 anytime touchdown targets (21 BUY, 1 PASS) with the Kalshi price and published fair value shown for each pick as published. Fair values are published post-shrinkage (FV_pub = ask + 0.70 × (model FV − ask)).',
    resultsTitle: 'NFL Week 9 Anytime TD Picks Results — MoneyFootball Settlement',
    resultsIntro: 'Week 9 settled Tuesday, November 10, 2026 from final box scores. The 21 BUYs went 6-15 and the Travis Kelce PASS was incorrect — he scored anyway, and the fade is posted as a loss. A bad week, posted in full, same as the good weeks. Closing ask is the last price-watch observation before settlement, not a settlement print; "n/a" means no 5-cent-or-larger watch move fired on that market all week.',
    weekLine: 'Week 9: BUYs 6-15; verdicts 6-16. HIGH-tier BUYs 5-14; MEDIUM-tier BUYs 1-1.',
    seasonLine: 'Season record: 37-27 → 43-43 (50.0%) after Week 9 — 86 settled verdicts on the season.',
    allTimeLine: 'All-time record: 350-190 → 356-206 (562 settled) after Week 9.',
    sniperLine: 'Sniper HIGH through Week 9: 24/55 = 43.6% (HIGH-confidence verdicts only, including PASS verdicts).',
    bandNote: 'Split by published fair value, computed from the published board and the settled outcomes: fair value .75 and up went 4-1; .60 to .75 went 1-8; under .60 went 1-6. By position (from the settlement record): RBs 4-5, WRs 1-2, TEs 1-6, QBs 0-2. Five misses carried last watch prints of 86 cents or higher (Shough 93¢, Gordon II 92¢, Loveland 91¢, Taylor 87¢, Hubbard 86¢) — the market chased scores that never came; settlement follows the box score.',
  },
];

export const EARLY_WEEKS = {
  title: 'NFL Weeks 1-4 Anytime TD Picks Results — MoneyFootball (Aggregate)',
  intro: 'The first four weeks of the 2026 run settled 23-11 across 34 picks. Per-pick boards for Weeks 1-4 were never committed to this site’s records — only the aggregate survives, carried in the Week 5 file’s performance block — so no per-pick picks, prices, or outcomes are listed here. Anything more specific would be reconstruction, and this archive does not reconstruct.',
  seasonLine: 'Season record after Week 4: 23-11 (34 settled picks).',
};
