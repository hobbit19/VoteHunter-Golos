<?php
/**
 * Created by PhpStorm.
 * User: roma
 * Date: 16.03.18
 * Time: 14:49
 */

namespace app\api\steem;

use GrapheneNodeClient\Connectors\WebSocket\SteemitWSConnector;

class SteemTestWSConnector extends SteemitWSConnector
{

    protected $nodeURL = 'wss://testnet.steem.vc';
}