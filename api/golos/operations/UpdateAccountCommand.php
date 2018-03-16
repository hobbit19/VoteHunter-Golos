<?php
/**
 * Created by PhpStorm.
 * User: roma
 * Date: 16.03.18
 * Time: 16:38
 */

namespace api\golos\operations;


use app\api\golos\GolosTestWSConnector;
use GrapheneNodeClient\Commands\DataBase\GetAccountCommand;
use GrapheneNodeClient\Connectors\WebSocket\GolosWSConnector;
use GrapheneNodeClient\Tools\ChainOperations\OpTransfer;

class UpdateAccountCommand extends GetAccountCommand
{
    public function update()
    {
    }
}