<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  header('Allow: POST');
  http_response_code(405);
  echo json_encode(['error' => 'Method not allowed.']);
  exit;
}

$salt = getenv('SALT');
if (!is_string($salt) || $salt === '') {
  http_response_code(503);
  echo json_encode(['error' => 'Private file access is not configured.']);
  exit;
}

$request = json_decode(file_get_contents('php://input'), true);
$segments = is_array($request) ? ($request['segments'] ?? null) : null;
$tokens = is_array($request) ? ($request['tokens'] ?? null) : null;
if (!is_array($segments) || !is_array($tokens) || count($segments) > 200 || count($tokens) > 100) {
  http_response_code(400);
  echo json_encode(['error' => 'Invalid private file request.']);
  exit;
}

$dataDirectory = realpath(__DIR__ . '/data');
if ($dataDirectory === false) {
  http_response_code(500);
  echo json_encode(['error' => 'Private data directory is unavailable.']);
  exit;
}

$validTokens = [];
foreach ($tokens as $token) {
  if (!is_string($token)) {
    continue;
  }

  if (preg_match('/\A[A-Za-z0-9_-]{43}=?\z/', $token) === 1) {
    $validTokens[] = rtrim($token, '=');
  }
}

$matchedSegments = [];
$privateFiles = [];
foreach ($segments as $pathSegment) {
  if (
    !is_array($pathSegment) ||
    !isset($pathSegment['segment'], $pathSegment['files']) ||
    !is_string($pathSegment['segment']) ||
    strlen($pathSegment['segment']) > 512 ||
    preg_match('/\A[^\/\\\\\x00-\x1F]+\z/u', $pathSegment['segment']) !== 1 ||
    !is_array($pathSegment['files']) ||
    count($pathSegment['files']) > 200
  ) {
    continue;
  }

  $matched = false;
  $expectedToken = rtrim(strtr(base64_encode(hash('sha256', "{$pathSegment['segment']} {$salt}", true)), '+/', '-_'), '=');
  foreach ($validTokens as $token) {
    if (hash_equals($expectedToken, $token)) {
      $matched = true;
      break;
    }
  }
  if (!$matched) {
    continue;
  }

  $matchedSegments[] = $pathSegment['segment'];
  $validFiles = [];
  foreach ($pathSegment['files'] as $file) {
    if (
      is_string($file) &&
      strlen($file) <= 512 &&
      preg_match('/\A[^.\/\\\\\x00-\x1F]+(?:\.[^.\/\\\\\x00-\x1F]+)?\.k\z/u', $file) === 1
    ) {
      $validFiles[] = $file;
    }
  }

  foreach (array_unique($validFiles) as $file) {
    $privatePath = realpath($dataDirectory . DIRECTORY_SEPARATOR . '.' . $file);
    if ($privatePath !== false && dirname($privatePath) === $dataDirectory && is_file($privatePath)) {
      $content = file_get_contents($privatePath);
      if ($content === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Unable to read a private file.']);
        exit;
      }
      $privateFiles[] = [
        'segment' => $pathSegment['segment'],
        'name' => $file,
        'content' => $content,
      ];
    }
  }
}

echo json_encode(['segments' => array_values(array_unique($matchedSegments)), 'files' => $privateFiles]);
