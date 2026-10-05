@echo off
title Moneyfootball.ai - TPI Defensive Audit
color 0A

echo ============================================================
echo   MONEYFOOTBALL.AI - QUANTITATIVE TD & DEFENSIVE AUDIT
echo ============================================================
echo.
echo Running TPI Defensive Model against Week 4 Backtest & Active Slate...
echo.

python test_defensive_pipeline.py

echo.
echo ============================================================
echo Audit complete.
echo ============================================================
echo.
pause