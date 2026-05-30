try {
    $r = Invoke-WebRequest -Uri 'http://localhost:3015' -UseBasicParsing -TimeoutSec 5
    "Status: $($r.StatusCode)" | Out-File check.txt
    "Content Length: $($r.Content.Length)" | Out-File check.txt -Append
    "Server is running OK" | Out-File check.txt -Append
} catch {
    "Error: $($_.Exception.Message)" | Out-File check.txt
}