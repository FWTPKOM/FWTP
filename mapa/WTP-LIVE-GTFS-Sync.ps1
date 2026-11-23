$ErrorActionPreference = 'Stop'
$base = Join-Path $HOME 'Desktop\WTP-LIVE'
$target = Join-Path $base 'gtfs'
$stage = Join-Path $base 'gtfs_sync_download'
$backup = Join-Path $base 'gtfs_sync_backup'
$key = Join-Path $HOME '.ssh\wtp_live_sync'
$remote = 'root@wanda294.mikrus.xyz'
$port = 10294
$log = Join-Path $base 'gtfs_sync.log'
$lockName = 'Local\WTP_LIVE_GTFS_SYNC'
$mutex = [System.Threading.Mutex]::new($false, $lockName)
$locked = $false
function Log($msg) { Add-Content -LiteralPath $log -Value "$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss') $msg" -Encoding UTF8 }
try {
    $locked = $mutex.WaitOne(0)
    if (-not $locked) { exit 0 }
    if (-not (Test-Path -LiteralPath $base -PathType Container)) { throw "Brak folderu: $base" }
    if (-not (Test-Path -LiteralPath $key -PathType Leaf)) { throw "Brak klucza SSH: $key" }
    if (Test-Path -LiteralPath $backup) {
        if (-not (Test-Path -LiteralPath $target)) { Rename-Item -LiteralPath $backup -NewName 'gtfs' }
        else { Remove-Item -LiteralPath $backup -Recurse -Force }
    }
    $remoteStatusText = & ssh -p $port -i $key -o IdentitiesOnly=yes -o BatchMode=yes -o ConnectTimeout=20 $remote 'cat /opt/wtp-live/gtfs/status.json'
    if ($LASTEXITCODE -ne 0) { throw 'Nie mozna odczytac statusu GTFS z Mikrusa' }
    $remoteStatus = ($remoteStatusText -join "`n") | ConvertFrom-Json
    $localStatusFile = Join-Path $target 'status.json'
    if (Test-Path -LiteralPath $localStatusFile) {
        try {
            $localStatus = Get-Content -LiteralPath $localStatusFile -Raw | ConvertFrom-Json
            if ($localStatus.updated_at -eq $remoteStatus.updated_at) { exit 0 }
        } catch { }
    }
    if (Test-Path -LiteralPath $stage) { Remove-Item -LiteralPath $stage -Recurse -Force }
    New-Item -ItemType Directory -Path $stage | Out-Null
    Log 'START'
    # Copy the entire remote directory to a temporary folder, without touching the live folder.
    & scp -B -q -r -P $port -i $key -o IdentitiesOnly=yes -o BatchMode=yes -o ConnectTimeout=20 "${remote}:/opt/wtp-live/gtfs/." "$stage/"
    if ($LASTEXITCODE -ne 0) { throw "SCP zakonczyl sie kodem $LASTEXITCODE" }
    $statusFile = Join-Path $stage 'status.json'
    if (-not (Test-Path -LiteralPath $statusFile -PathType Leaf)) { throw 'Brak status.json w pobranych danych' }
    $status = Get-Content -LiteralPath $statusFile -Raw | ConvertFrom-Json
    $remoteStatusAfterText = & ssh -p $port -i $key -o IdentitiesOnly=yes -o BatchMode=yes -o ConnectTimeout=20 $remote 'cat /opt/wtp-live/gtfs/status.json'
    if ($LASTEXITCODE -ne 0) { throw 'Nie mozna ponownie odczytac statusu GTFS' }
    $remoteStatusAfter = ($remoteStatusAfterText -join "`n") | ConvertFrom-Json
    if ($status.updated_at -ne $remoteStatus.updated_at -or $status.updated_at -ne $remoteStatusAfter.updated_at) {
        throw 'Dane zmienily sie w trakcie pobierania; ponowienie przy nastepnym uruchomieniu'
    }
    if ($status.date -notmatch '^\d{8}$' -or [int]$status.lines -lt 1) { throw 'Nieprawidlowy status.json' }
    $jsonCount = @(Get-ChildItem -LiteralPath $stage -Filter '*.json' -File).Count
    if ($jsonCount -lt [int]$status.lines) { throw "Za malo plikow JSON: $jsonCount; status lines=$($status.lines)" }
    # Swap directories on the same volume. If replacement fails, restore previous data.
    if (Test-Path -LiteralPath $target) { Rename-Item -LiteralPath $target -NewName 'gtfs_sync_backup' }
    try { Rename-Item -LiteralPath $stage -NewName 'gtfs' }
    catch {
        if ((Test-Path -LiteralPath $backup) -and -not (Test-Path -LiteralPath $target)) { Rename-Item -LiteralPath $backup -NewName 'gtfs' }
        throw
    }
    if (Test-Path -LiteralPath $backup) { Remove-Item -LiteralPath $backup -Recurse -Force }
    Log "OK date=$($status.date) lines=$($status.lines) files=$jsonCount"
} catch {
    Log "BLAD: $($_.Exception.Message)"
    exit 1
} finally {
    if ($locked) { $mutex.ReleaseMutex() }
    $mutex.Dispose()
}
