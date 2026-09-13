@echo off
setlocal
rem Restore standard Windows variables omitted by some remote launch environments.
if not defined SystemDrive set "SystemDrive=%SystemRoot:~0,2%"
if not defined ComSpec set "ComSpec=%SystemRoot%\System32\cmd.exe"
if not defined TMP set "TMP=%TEMP%"
if not defined ProgramData set "ProgramData=%SystemDrive%\ProgramData"
if not defined ALLUSERSPROFILE set "ALLUSERSPROFILE=%ProgramData%"
if not defined ProgramFiles set "ProgramFiles=%SystemDrive%\Program Files"
if not defined ProgramW6432 set "ProgramW6432=%ProgramFiles%"
if not defined ProgramFiles(x86) set "ProgramFiles(x86)=%SystemDrive%\Program Files (x86)"
if not defined CommonProgramFiles set "CommonProgramFiles=%ProgramFiles%\Common Files"
if not defined CommonProgramFiles(x86) set "CommonProgramFiles(x86)=%ProgramFiles(x86)%\Common Files"
if not defined CommonProgramW6432 set "CommonProgramW6432=%CommonProgramFiles%"
set "qUnity=%ProgramFiles%\Unity\Hub\Editor\6000.6.0f1\Editor\Unity.exe"
if not exist "%qUnity%" (echo Unity Editor not found at "%qUnity%" & exit /b 2)
if "%~1"=="" (
 start "" "%qUnity%" -projectPath "%~dp0PunkinMotionLab" -logFile "%~dp0Unity-interactive.log"
 exit /b 0
)
start "" /wait "%qUnity%" %*
exit /b %errorlevel%
