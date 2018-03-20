<?php

namespace app\api\GrapheneNodeClient;

use GrapheneNodeClient\Commands\Broadcast\BroadcastTransactionCommand;
use GrapheneNodeClient\Commands\Broadcast\BroadcastTransactionSynchronousCommand;
use GrapheneNodeClient\Commands\CommandQueryData;
use GrapheneNodeClient\Connectors\ConnectorInterface;

class OpTransfer
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
        $tx = TestTransaction::init($connector);
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
        TestTransaction::sign($chainName, $tx, ['active' => $privateActiveWif]);

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
        $tx = TestTransaction::init($connector);
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
        TestTransaction::sign($chainName, $tx, ['active' => $privateActiveWif]);

        $answer = $command->execute(
            $tx
        );

        return $answer;
    }


}