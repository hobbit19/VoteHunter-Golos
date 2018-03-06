<?php
/**
 * Created by PhpStorm.
 * User: roma
 * Date: 05.03.18
 * Time: 17:05
 */
namespace app\api\golos;

use GrapheneNodeClient\Commands\CommandQueryData;
use GrapheneNodeClient\Commands\DataBase\GetDiscussionsByCreatedCommand;
use GrapheneNodeClient\Connectors\WebSocket\GolosWSConnector;
use GrapheneNodeClient\Connectors\WebSocket\SteemitWSConnector;

class GolosApi
{
    const ACC_GOLOS_ALL = 'all';
    const ACC_GOLOS_PROFILE = 'profile';
    public function getAccount($strNickName, $returnType = self::ACC_GOLOS_ALL)
    {
        $connector = new GolosWSConnector();
        $objCommand = new \GrapheneNodeClient\Commands\DataBase\GetAccountCommand($connector);
        $commandQuery = new CommandQueryData();
        $data = [
            [ $strNickName ]
        ];
        $commandQuery->setParams($data);
        $arrData = $objCommand->execute($commandQuery);
        switch ($returnType) {
            case self::ACC_GOLOS_ALL:
                return $arrData;
            case self::ACC_GOLOS_PROFILE:
                $arrProfile = json_decode($arrData['result'][0]['json_metadata'], true);
                return $arrProfile['profile'];
        }

        /* ["json_metadata"]=>string(332)
        "{"profile":
        {"name":"Роман Сирота",
        "profile_image":"https://images.golos.io/DQmc92P7Lxjgi4zW7p14E2HMPosPewr2Tbm1eCsejfivfB4/logo-mode-150x150.png",
        "cover_image":"https://images.golos.io/DQmVtmCbCBGYbwic1uyxECBdicajp1A6nzpQqjtnnefAz2m/screenshot_1516805843.png",
        "about":"Мой проект",
        "website":"http://deskle.com"}}" */

    }

}