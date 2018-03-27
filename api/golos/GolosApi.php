<?php
/**
 * Created by PhpStorm.
 * User: roma
 * Date: 05.03.18
 * Time: 17:05
 */
namespace app\api\golos;

use app\api\GrapheneNodeClient\OpTransfer;
use GrapheneNodeClient\Commands\Broadcast\BroadcastTransactionSynchronousCommand;
use GrapheneNodeClient\Commands\CommandQueryData;
use GrapheneNodeClient\Commands\DataBase\GetDiscussionsByBlogCommand;
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
        //TODO: uncomment in poduction
        //$connector = new GolosWSConnector();
        $connector = new GolosTestWSConnector();
        $objCommand = new \GrapheneNodeClient\Commands\DataBase\GetAccountCommand($connector);
        $commandQuery = new CommandQueryData();
        $data = [
            [$strNickName]
        ];
        $commandQuery->setParams($data);
        $arrData = $objCommand->execute($commandQuery);
        $arrReturn = [];
        switch ($returnType) {
            case self::ACCOUNT_GOLOS_ALL:
                return $arrData;
            case self::ACCOUNT_GOLOS_PROFILE:
                if(isset($arrData['result']) && count($arrData['result'])) {
                    $arrReturn['balance'] = $arrData['result'][0]['balance'];
                    $arrData = json_decode($arrData['result'][0]['json_metadata'], true);
                    if (isset($arrData['profile'])) {
                        $arrReturn['profile'] = $arrData['profile'];
                    } else {
                        $arrReturn['profile'] = [];
                    }
                    $arrReturn['json_metadata'] = $arrData;
                } else {
                    return false;
                }
                return $arrReturn;
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
                    'parent_author' => '',
                    'parent_permlink' => 'yousource',
                    'author' => $arrData['author'],
                    'permlink' => $arrData['permlink'],
                    'title' => $arrData['title'],
                    'body' => $arrData['body'],
                    'json_metadata' => empty($arrData['json_metadata']) ? json_encode([]) : json_encode($arrData['json_metadata'])
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

    public function updateProfile($objProfile)
    {

    }

    public function getDiscussionsByBlog($strUserName, $strTag)
    {
        //TODO: uncomment in poduction
        //$connector = new GolosWSConnector();
        $connector = new GolosTestWSConnector();
        $objCommand = new GetDiscussionsByBlogCommand($connector);
        $commandQuery = new CommandQueryData();
        $commandQuery->setParamByKey('0:limit', 10);
        $commandQuery->setParamByKey('0:select_authors', [$strUserName]);
        $commandQuery->setParamByKey('0:select_tags', [$strTag]);

        $arrPrepare = $objCommand->execute($commandQuery);
        $arrData = [];
        if(isset($arrPrepare['result'])) {
            foreach ($arrPrepare['result'] as $arrValue) {
                $arrData[$arrValue['permlink']] = $arrValue;
            }
        }
        unset($arrPrepare);
        return $arrData;

    }

    public function transfer($strWifFrom, $strUserFrom, $strUserTo, $fltSum, $strMemo)
    {
        $connector = new GolosTestWSConnector();
        try{
            $answer = OpTransfer::doSynchronous(
                $connector,
                $strWifFrom,
                $strUserFrom,
                $strUserTo,
                sprintf('%01.3f GOLOS', $fltSum),
                $strMemo
            );

            print_r($answer);

        }catch (Exception $e){
            return [
                'status' => 'error',
                'msg' => $e->getMessage()
            ];
        }

    }


}