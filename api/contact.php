
<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

header('Content-Type: application/json; charset=utf-8');

function respond(array $data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(['success' => false, 'message' => 'Method not allowed'], 405);
}

// Honeypot anti-spam
if (!empty($_POST['website'])) {
    respond(['success' => true]);
}

// Private configuration
$config = require dirname(__DIR__, 2) . '/mail-config.php';

// PHPMailer
require __DIR__ . '/PHPMailer/Exception.php';
require __DIR__ . '/PHPMailer/PHPMailer.php';
require __DIR__ . '/PHPMailer/SMTP.php';

$name = trim($_POST['name'] ?? '');
$contact = trim($_POST['contact'] ?? '');
$message = trim($_POST['message'] ?? '');
$product = trim($_POST['product'] ?? '');

$pageUrl = trim($_POST['page_url'] ?? 'Не визначено');
$referrer = trim($_POST['referrer'] ?? 'Прямий перехід або невідомо');

$utmSource = trim($_POST['utm_source'] ?? '');
$utmMedium = trim($_POST['utm_medium'] ?? '');
$utmCampaign = trim($_POST['utm_campaign'] ?? '');

if ($name === '' || $contact === '' || $message === '') {
    respond([
        'success' => false,
        'message' => 'Заповніть обов’язкові поля'
    ], 422);
}

if (
    mb_strlen($name) > 100 ||
    mb_strlen($contact) > 200 ||
    mb_strlen($message) > 5000 ||
    mb_strlen($product) > 255 ||
    mb_strlen($utmSource) > 255 ||
    mb_strlen($utmMedium) > 255 ||
    mb_strlen($utmCampaign) > 255
) {
    respond([
        'success' => false,
        'message' => 'Перевищено допустиму довжину поля'
    ], 422);
}

// 1. Send lead to CRM
$crmPayload = [
    'name' => $name,
    'phone' => $contact,
    'product' => $product,
    'message' => $message,
    'page_url' => $pageUrl,
    'referrer' => $referrer,
    'utm_source' => $utmSource,
    'utm_medium' => $utmMedium,
    'utm_campaign' => $utmCampaign,
];

$crmUrl = $config['crm_api_url'] ?? '';
$crmToken = $config['crm_api_token'] ?? '';

if ($crmUrl === '' || $crmToken === '') {
    error_log('CRM integration error: missing configuration');
    respond([
        'success' => false,
        'message' => 'Не вдалося відправити заявку. Спробуйте пізніше.'
    ], 502);
}

$ch = curl_init($crmUrl);

curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Accept: application/json',
        'X-Website-Token: ' . $crmToken,
    ],
    CURLOPT_POSTFIELDS => json_encode(
        $crmPayload,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    ),
    CURLOPT_CONNECTTIMEOUT => 5,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
]);

$crmResponse = curl_exec($ch);
$crmHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$crmError = curl_error($ch);

curl_close($ch);

$crmData = is_string($crmResponse)
    ? json_decode($crmResponse, true)
    : null;

if (
    $crmResponse === false ||
    $crmHttpCode !== 201 ||
    !is_array($crmData) ||
    empty($crmData['success']) ||
    empty($crmData['leadId'])
) {
    error_log(
        'CRM integration failed. HTTP: ' . $crmHttpCode .
        '; cURL error: ' . $crmError .
        '; response: ' . (is_string($crmResponse) ? $crmResponse : 'no response')
    );

    respond([
        'success' => false,
        'message' => 'Не вдалося відправити заявку. Спробуйте пізніше.'
    ], 502);
}

// 2. Send email notification (CRM lead already created)
try {
    $mail = new PHPMailer(true);

    $mail->isSMTP();
    $mail->Host = $config['host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['username'];
    $mail->Password = $config['password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $config['port'];
    $mail->CharSet = 'UTF-8';

    $mail->setFrom($config['from_email'], $config['from_name']);
    $mail->addAddress($config['to_email']);

    $mail->Subject = 'Нова заявка з сайту Різнобит';

    $mail->Body =
        "Нова заявка з сайту raznobyt.com\n\n" .
        "CRM ID: {$crmData['leadId']}\n" .
        "Ім'я: {$name}\n" .
        "Контакт: {$contact}\n" .
        "Товар: {$product}\n\n" .
        "Повідомлення:\n{$message}\n\n" .
        "Сторінка: {$pageUrl}\n" .
        "Звідки перейшов: {$referrer}\n" .
        "UTM Source: {$utmSource}\n" .
        "UTM Medium: {$utmMedium}\n" .
        "UTM Campaign: {$utmCampaign}\n";

    $mail->send();

} catch (Exception $e) {
    error_log('Contact email error: ' . $e->getMessage());
}

// CRM прийняла заявку — повертаємо успіх
respond([
    'success' => true,
    'message' => 'Заявку успішно відправлено',
    'leadId' => $crmData['leadId'],
]);
