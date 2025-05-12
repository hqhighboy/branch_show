@echo off
echo 启动党支部数据展示系统（集成智能分析）...

echo 启动服务器...
start /b node server.js

echo 等待服务器启动...
timeout /t 3 /nobreak > nul

echo 打开集成页面...
start integrate.html

echo 系统已启动！
echo.
echo 如需查看原始页面，请打开 build\index.html
echo 如需单独查看智能分析功能，请打开 intelligent_analysis.html
echo.
