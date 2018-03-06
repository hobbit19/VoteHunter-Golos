<?php
/**
 * Created by PhpStorm.
 * User: roma
 * Date: 05.03.18
 * Time: 17:15
 */
namespace api\golos\operations;

use GrapheneNodeClient\Commands\Broadcast\BroadcastTransactionCommand;
use GrapheneNodeClient\Commands\Broadcast\BroadcastTransactionSynchronousCommand;
use GrapheneNodeClient\Commands\CommandQueryData;
use GrapheneNodeClient\Connectors\ConnectorInterface;
use GrapheneNodeClient\Tools\Transaction;

class OpGetAccount
{
    /**
     * @param ConnectorInterface $connector
     * @param string             $from
     * @param string             $privateActiveWif
     * @param string             $to
     * @param string             $amountWithAsset
     * @param string             $memo
     *
     * @return mixed
     * @throws \Exception
     */
    public static function do(ConnectorInterface $connector, $privateActiveWif, $from, $to, $amountWithAsset, $memo)
    {
        $chainName = $connector->getPlatform();
        /** @var CommandQueryData $tx */
        $tx = Transaction::init($connector);
        $tx->setParamByKey(
            '0:operations:0',
            [
                'transfer',
                [
                    'from'   => $from,
                    'to'     => $to,
                    'amount' => $amountWithAsset,
                    'memo'   => $memo
                ]
            ]
        );

        $command = new BroadcastTransactionCommand($connector);
        Transaction::sign($chainName, $tx, ['active' => $privateActiveWif]);

        $answer = $command->execute(
            $tx
        );

        return $answer;
    }

    /**
     * @param ConnectorInterface $connector
     * @param string             $from
     * @param string             $privateActiveWif
     * @param string             $to
     * @param string             $amountWithAsset
     * @param string             $memo
     *
     * @return mixed
     * @throws \Exception
     */
    public static function doSynchronous(ConnectorInterface $connector, $privateActiveWif, $from, $to, $amountWithAsset, $memo)
    {
        $chainName = $connector->getPlatform();
        /** @var CommandQueryData $tx */
        $tx = Transaction::init($connector);
        $tx->setParamByKey(
            '0:operations:0',
            [
                'transfer',
                [
                    'from'   => $from,
                    'to'     => $to,
                    'amount' => $amountWithAsset,
                    'memo'   => $memo
                ]
            ]
        );

        $command = new BroadcastTransactionSynchronousCommand($connector);
        Transaction::sign($chainName, $tx, ['active' => $privateActiveWif]);

        $answer = $command->execute(
            $tx
        );

        return $answer;
    }


}