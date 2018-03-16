<?php
/**
 * Created by PhpStorm.
 * User: roma
 * Date: 16.03.18
 * Time: 14:49
 */

namespace app\api\golos;

use GrapheneNodeClient\Connectors\WebSocket\GolosWSConnector;

class GolosTestWSConnector extends GolosWSConnector
{

    protected $nodeURL = 'wss://ws.testnet3.golos.io';
}