<?php
//$arrAuthConfig = parse_ini_file(require __DIR__ . 'auth.ini', true);

$params = require __DIR__ . '/params.php';
$strLocalParams = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'local' . DIRECTORY_SEPARATOR . 'params.php';
if (file_exists($strLocalParams)) {
    $arrLocalParams = require_once $strLocalParams;
    if(is_array($arrLocalParams)) {
        $params = array_replace_recursive($params, $arrLocalParams);
    }
}

$db = require __DIR__ . '/db.php';

$config = [
    'id' => 'basic',
    'basePath' => dirname(__DIR__),
    'bootstrap' => ['log'],
    'aliases' => [
        '@bower' => '@vendor/bower-asset',
        '@npm'   => '@vendor/npm-asset',
    ],
    'components' => [
/*        'authClientCollection' => [
            'class' => 'yii\authclient\Collection',
            'clients' => [
                'google' => [
                    'class' => 'yii\authclient\clients\Google',
                    'clientId' => $arrAuthConfig['googleClientId'],
                    'clientSecret' => $arrAuthConfig['googleSecret'],
                ],
                'facebook' => [
                    'class' => 'yii\authclient\clients\Facebook',
                    'clientId' => 'facebook_client_id',
                    'clientSecret' => 'facebook_client_secret',
                ],
            ],
        ],*/
        'request' => [
            'cookieValidationKey' => 'SKJba!jWHg^626V2S5V2SdDSDC#ddccc',
            'parsers' => [
                'application/json' => 'yii\web\JsonParser',
            ]
        ],
        'cache' => [
            'class' => 'yii\caching\FileCache',
        ],
        'user' => [
            'identityClass' => 'app\models\User',
            'enableAutoLogin' => true,
        ],
        'errorHandler' => [
            'errorAction' => 'site/error',
        ],
        'mailer' => [
            'class' => 'yii\swiftmailer\Mailer',
            // send all mails to a file by default. You have to set
            // 'useFileTransport' to false and configure a transport
            // for the mailer to send real emails.
            'useFileTransport' => true,
        ],
        'log' => [
            'traceLevel' => YII_DEBUG ? 3 : 0,
            'targets' => [
                [
                    'class' => 'yii\log\FileTarget',
                    'levels' => ['error', 'warning'],
                ],
            ],
        ],
        'db' => $db,
        'urlManager' => [
            'enablePrettyUrl' => true,
            'showScriptName' => false,
            'rules' => [

                    '/dashboard' => 'site/index',
                    '/profile' => 'site/index',
                    '/login' => 'site/index',
                    '/add-post' => 'site/index',
                    '/post' => 'site/index',
                    '/payment' => 'site/index',
                    '/edit-profile' => 'site/index',
            ],
        ],
//        'view' => [
//            'theme' => [
//                'basePath' => '@webroot',
//                'pathMap' => [
//                    '@app/views' => [
//                        '@webroot'
//                    ]
//                ]
//            ],
//        ],

    ],
    'params' => $params,
];

if (YII_ENV_DEV) {
    // configuration adjustments for 'dev' environment
    $config['bootstrap'][] = 'debug';
    $config['modules']['debug'] = [
        'class' => 'yii\debug\Module',
        // uncomment the following to add your IP if you are not connecting from localhost.
        //'allowedIPs' => ['127.0.0.1', '::1'],
    ];

    $config['bootstrap'][] = 'gii';
    $config['modules']['gii'] = [
        'class' => 'yii\gii\Module',
        // uncomment the following to add your IP if you are not connecting from localhost.
        //'allowedIPs' => ['127.0.0.1', '::1'],
    ];
}

return $config;
