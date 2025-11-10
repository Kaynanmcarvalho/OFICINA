@echo off
echo Limpando sessões de teste...
cd whatsapp_sessions
for /d %%i in (empresa-test-*) do (
    echo Removendo %%i...
    rmdir /s /q "%%i"
)
for /d %%i in (empresa-temp-*) do (
    echo Removendo %%i...
    rmdir /s /q "%%i"
)
echo Limpeza concluída!
cd ..
