
<?php
ini_set('display_errors', '0');

header('Content-Type: text/plain; charset=utf-8');

echo "STEP 1: PHP works\n";

echo "STEP 2: Checking paths\n";

echo "Current directory: " . __DIR__ . "\n";

$configPath = dirname(__DIR__, 2) . '/mail-config.php';

echo "Config path: " . $configPath . "\n";

echo "Config exists: " . (file_exists($configPath) ? 'YES' : 'NO') . "\n";

echo "STEP 3: Checking PHPMailer\n";

echo "PHPMailer exists: " .
    (file_exists(__DIR__ . '/PHPMailer/PHPMailer.php') ? 'YES' : 'NO') . "\n";

echo "DONE";
