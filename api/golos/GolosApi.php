<?php
/**
 * Created by PhpStorm.
 * User: roma
 * Date: 05.03.18
 * Time: 17:05
 */
namespace app\api\golos;

use GrapheneNodeClient\Commands\Broadcast\BroadcastTransactionSynchronousCommand;
use GrapheneNodeClient\Commands\CommandQueryData;
use GrapheneNodeClient\Commands\DataBase\GetDiscussionsByCreatedCommand;
use GrapheneNodeClient\Connectors\WebSocket\GolosWSConnector;
use GrapheneNodeClient\Connectors\WebSocket\SteemitWSConnector;
use GrapheneNodeClient\Tools\ChainOperations\ChainOperations;
use GrapheneNodeClient\Tools\Transaction;

class GolosApi
{
    const ACCOUNT_GOLOS_ALL = 'all';
    const ACCOUNT_GOLOS_PROFILE = 'profile';

    public function getAccount($strNickName, $returnType = self::ACCOUNT_GOLOS_ALL)
    {
        //$connector = new GolosWSConnector();
        $connector = new GolosTestWSConnector();
        $objCommand = new \GrapheneNodeClient\Commands\DataBase\GetAccountCommand($connector);
        $commandQuery = new CommandQueryData();
        $data = [
            [ $strNickName ]
        ];
        $commandQuery->setParams($data);
        $arrData = $objCommand->execute($commandQuery);
        switch ($returnType) {
            case self::ACCOUNT_GOLOS_ALL:
                return $arrData;
            case self::ACCOUNT_GOLOS_PROFILE:
                $arrProfile = json_decode($arrData['result'][0]['json_metadata'], true);
                return isset($arrProfile['profile']) ? $arrProfile['profile'] : [];
        }
        return $arrData;

    }

    public function comment(array $arrData)
    {
        $connector = new GolosWSConnector();
        $tx = Transaction::init($connector);
        $tx->setParamByKey(
            '0:operations:0',
            [
                ChainOperations::OPERATION_COMMENT,
                [
                    'parent_author'    => '',
                    'parent_permlink'   => 'votehunter',
                    'author' =>  $arrData['author'],
                    'permlink'   => $arrData['permlink'],
                    'title'   => $arrData['title'],
                    'body' => $arrData['body'],
                    'json_metadata'   => empty($arrData['json_metadata']) ? json_encode([]) : json_encode($arrData['json_metadata'])
                ]
            ]
        );
        $command = new BroadcastTransactionSynchronousCommand($connector);
        Transaction::sign('golos', $tx, ['posting' => '5KkZmMC9JN2Vsps4b3Vs8HWscKMTWbMK75E51RisEbSeeHzH2Tz']);

        $answer = $command->execute(
            $tx
        );
        var_dump($answer);
    }

}